/*
 *  Collection of event listenters for bot operation.
 */

const Discord = require('discord.js');
const CmdParser = require('./cmdparser.js');
const logger = require('./logger.js');
const auth = require('./auth.json');

// Initialize Discord Bot
var bot = new Discord.Client();
var cmd = new CmdParser();

//Event listener for when bot successfully logs on
bot.on('ready', (evt) =>
    {
        logger.info('Connected: Logged in as:' + bot.user.username + ' id:' + bot.user.id);
    }
);

//Event listener for anytime a message is posted in a channel that our bot
//has access to. Don't worry, I'm not logging everyone's messages to the bot.
bot.on('message', msg =>
    {
        cmd.data = msg;
        cmd.parseInput();
    }
);

//Event listener for anytime a command is used. Output message gets sent to
//proper channel here.
cmd.on('cmd', (e) =>
    {
        logger.info(e.data.username + ' used ' + e.cmd);
        selectChannel(e.ch, e.data, e.out);
    }
);

//Event listener for any errors thrown by a command.
cmd.on('err', (e) =>
    {
        logger.info(e.cmd + ' threw an error for ' + e.data.username + ':' + e.err);
        selectChannel(e.ch, e.data, e.out);
    }
);

//Utility function to select output channel for sending messages from the bot.
function selectChannel(channel, data, output)
{
    switch(channel)
    {
        case 'ch': data.channel.send(output); break;
        case 're': data.msg.reply(output); break;
        case 'dm': data.usr.send(output); break;
    }
}

bot.login(auth.token)
