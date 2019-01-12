const Discord = require('discord.js');
const CmdParser = require('./cmdparser.js');
const logger = require('winston');
const auth = require('./auth.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console,
    {
        colorize: true
    }
);
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client();
var cmd = new CmdParser();

//Event listener for when bot successfully logs on
bot.on('ready', (evt) =>
    {
        logger.info('Connected');
        logger.info('Logged in as: ' + bot.user);
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
cmd.on('cmd', (d, c, msg, ch) =>
    {
        logger.log('info', d.username + ' used ' + c);
        selectChannel(ch, d, msg);
    }
);

//Event listener for any errors thrown by a command.
cmd.on('err', (d, c, msg, ch) =>
    {
        logger.log('info', c + ' threw an error:\n' + msg);
        selectChannel(ch, d, msg);
    }
);

//Utility function to select output channel for sending messages from the bot.
function selectChannel(ch, d, msg)
{
    switch(ch)
    {
        case 'ch': d.channel.send(msg); break;
        case 'dm': d.usr.send(msg); break;
        case 're': d.msg.reply(msg); break;
    }
}

bot.login(auth.token)
