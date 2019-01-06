const Discord = require('discord.js');
const logger = require('winston');
const auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
const bot = new Discord.Client();

bot.on('ready', (evt) => {
    logger.info('Connected');
    logger.info('Logged in as: ' + bot.user);
});

var command_list = ["!ping", "!me", "!wakeup", "!shutup"];
var bIsAwake = false;
bot.on('message', msg => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (msg.content.substring(0, 1) == '!') {
        var args = msg.content.substring(1).split(' ');
        var cmd = args[0];
        switch(cmd) {
            // !ping
            case 'ping':
                msg.reply('Pong!');
            break;
            case 'me':
                msg.channel.send(msg.author.username);
            break;

            case 'wakeup':
                bIsAwake = true;
                msg.reply('I\'m awake!');
            break;

            case 'shutup':
                bIsAwake = false;
                msg.reply('DON\'T TELL ME WHAT TO DO!')
            break;
        }
    }

    //INEPT_bot insult replies. INEPT_bot will take input strings and return
    //some output that sounds similar
    if (bIsAwake){

    }
});
bot.login(auth.token)
