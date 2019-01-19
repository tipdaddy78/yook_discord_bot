/*
 *  Collection of event listenters for bot operation.
 */

const Discord = require('discord.js');
const MessageParser = require('./MessageParser.js');
const logger = require('./Logger.js');
const auth = require('./auth.json');

// Initialize Discord Bot
var bot = new Discord.Client();
var input = new MessageParser();


//Event listener for when bot successfully logs on
bot.on('ready', (evt) =>
    {
        logger.info(`Connected: Logged in as: ${bot.user.username}  id: ${bot.user.id}`);
    }
);

//Event listener for anytime a message is posted in a channel that our bot
//has access to. Don't worry, I'm not logging everyone's messages to the bot.
bot.on('message', msg =>
    {
        if(input.isCommand(msg.content[0]))
        {
            input.set(msg);
            let cmd = input.command();
            input.execute(cmd);
        }
    }
);

//Event listener for anytime a command is used. Output message gets sent to
//proper channel here.
input.on('cmd', (e) =>
    {
        logger.info(`${e.data.username} used !${e.data.cmd}`);
        sendToChannel(e.ch, e.data, e.out);
    }
);

//Event listener for any errors thrown by a command.
input.on('err', (e) =>
    {
        logger.info(`${e.data.cmd} threw an error for ${e.data.username} :  ${e.err}`);
        sendToChannel(e.ch, e.data, e.out);
    }
);

process.on('uncaughtException', msg =>
    {
        logger.errToFile(msg);
        logger.errToConsole('Bot crashed. Check crash.log');
    }
);

//Utility function to select output channel for sending messages from the bot.
function sendToChannel(channel, data, output)
{
    switch(channel)
    {
        case 'ch': data.channel.send(output); break;
        case 're': data.msg.reply(output); break;
        case 'dm': data.usr.send(output); break;
    }
}

bot.login(auth.token);
