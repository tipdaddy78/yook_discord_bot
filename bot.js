const Discord = require('discord.js');
const logger = require('winston');
const auth = require('./auth.json');
const Cmd = require('./command.js');

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


var commands = ["ping", "me", "wakeup", "shutup", "checkmod", "help", "addlink"];
var bIsAwake = false;
bot.on('message', msg => {
    let c = new Cmd(msg);

    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (msg.content[0] == '!') {
        var args = msg.content.substring(1).split(' ');
        var cmd = args[0];
        switch(commands.indexOf(cmd)) {
            // !ping
            case 0: c.cmdPing(args[1]);
            break;
            case 1: c.cmdMe();
            break;

            case 2: c.cmdWakeUp();
            break;

            case 3: c.cmdShutUp();
            break;

            case 4: c.cmdCheckMod(args[1]);
            break;
            //TODO: Help command will provide information for specified commands.
            //Example:  !help
            //          To use help, type !help [cmd]
            //          !help cmd
            //          To use cmd, type !cmd [arg1] [arg2]... [argN]
            case 5:

            break;
        }
    }
    //INEPT_bot insult replies. INEPT_bot will take input strings and return
    //some output that sounds similar
    if (bIsAwake){

    }
});
bot.login(auth.token)
