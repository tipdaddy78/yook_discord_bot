const Discord = require('discord.js');
const CmdParser = require('./cmdparser.js');
const logger = require('winston');
const auth = require('./auth.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client();
var cmd = new CmdParser();

bot.on('ready', (evt) => {
    logger.info('Connected');
    logger.info('Logged in as: ' + bot.user);
});


bot.on('message', msg => {
    cmd.data = msg;
    cmd.parseInput();
});

cmd.on('cmd', (d, c, msg, ch) => {
    logger.log('info', d.username + ' used ' + c);
    selectChannel(ch, d, msg);
});

cmd.on('err', (d, c, msg, ch) => {
    logger.log('info', c + ' threw an error:\n' + msg);
    selectChannel(ch, d, msg);
});

function selectChannel(ch, d, msg) {
    switch(ch) {
        case 'ch': d.channel.send(msg); break;
        case 'dm': d.usr.send(msg); break;
        case 're': d.msg.reply(msg); break;
    }
}

bot.login(auth.token)
