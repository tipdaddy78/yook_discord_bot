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

var mod_list = ["ch1pset", "tipdaddy"];
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
            // Just add any case commands if you want to..
            case 'addmod':
                if(mod_list.includes(msg.author.username))
                    mod_list.push(args[1]);
            break;
            case 'removemod':
                if(mod_list.includes(msg.author.username))
                    mod_list.splice(mod_list.indexOf(args[1]), 1);
            break;
            case 'showmods':
                msg.channel.send(mod_list);
            break;
            case 'me':
                msg.channel.send(msg.author.username);
         }
     }
});
bot.login(auth.token)
