/*
 *  Collection of event listenters for bot operation.
 */

const Discord = require('discord.js');
const MessageParser = require('./MessageParser.js');
const logger = require('../Logs/logger.js');
const auth = require('./auth.json');

// Initialize Discord Bot
// var bot = new Discord.Client();
var input = new MessageParser();
var client = {};
let bSessionActive = false;
let bKilled = false;

function addBotListeners(bot)
{
    //Event listener for when bot successfully logs on
    bot.on('ready', (evt) =>
    {
        logger.info(`Connected`);
        logger.info(`Logged in as: ${bot.user.username}`);
        logger.info(`id: ${bot.user.id}`);
    });

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
    });

    // Create an event listener for new guild members
    bot.on('guildMemberAdd', member =>
    {
        logger.info(`${member.displayName} has joined the ${member.guild.name} server!`)
        // Send the message to a designated channel on a server:
        const channel = member.guild.channels.find(ch => ch.name === 'newcomers' || ch.name === 'testing');
        // Do nothing if the channel wasn't found on this server
        if (!channel) return;
        // Send the message, mentioning the member
        channel.send(`Welcome to the server, ${member}!`);
                    // + `I am INEPT, my creator is ch1pset.`
                    // + `If you are interested in speedrunning YL, I have some useful commands you may use to find resources.`
                    // + `Use !help for a list of commands and how to use them.`
                    // + `To keep spam out of the channels, I will reply spammy searches in a DM`);
    });

    bot.on('disconnect', (e) =>
    {
        bSessionActive = false;
        logger.info(e);
        logger.info(`Client has disconnected. Type \'restart\' to begin a new session.`);
    });
}

//Event listener for anytime a command is used. Output message gets sent to
//proper channel here.
input.on('cmd', (e) =>
{
    logger.info(`${e.data.username} used !${e.data.cmd}`);
    try
    {
        sendToChannel(e.ch, e.data, e.out);
    }
    catch(e)
    {
        logger.error(e);
    }
});

process.on('uncaughtException', msg =>
{
    logger.errToFile(msg);

    logger.errToConsole('Bot crashed. Check crash.log');
});

process.on('exit', (code) =>
{
    if(code === 0)
        logger.info(`Exited successfully`);
    else
        logger.error(`Exited with code ${code}`);
});

process.stdin.on('readable', () =>
{
    let chunk;
    while((chunk = process.stdin.read()) !== null)
    {
        let cmd_in = /[\w]*\b([\w]*\b)/i.exec(chunk.toString());
        switch(cmd_in? cmd_in[0]:null)
        {
            case 'restart':
            killBot();
            initBot(auth.test_bot);
            break;
            case 'kill':
            killBot();
            break;
            case 'mem':
            process.stdout.write(`${JSON.stringify(process.memoryUsage(), null, 2)}`);
            break;
            case 'exit': case 'quit':
            killBot();
            process.exit(0);
        }
    }
});

function initBot(token)
{
    client.bot = new Discord.Client();
    addBotListeners(client.bot);
    client.bot.login(token);
    bSessionActive = true;
    bKilled = false;
}

function killBot()
{
    if(client.bot)
    {
        client.bot.destroy();
        logger.info(`Bot was destroyed`);
        bKilled = true;
    }
}

//Utility function to select output channel for sending messages from the bot.
function sendToChannel(channel, data, output)
{
    switch(channel)
    {
        case 'ch': data.channel.send(output); break;
        case 're': data.channel.send(`${data.usr}\n` + output); break;
        case 'dm': data.usr.send(output); break;
    }
}
setInterval(() =>
{
    try
    {
        if(!bSessionActive && !bKilled)
        {
            initBot(auth.test_bot);
            logger.logToConsole(`Commands: restart, kill, mem, exit`);
        }
    }
    catch(e)
    {
        logger.error(e);
        logger.info(`Bot crashed, restarting bot...`);
        initBot(auth.test_bot);
    }
}, 500);
