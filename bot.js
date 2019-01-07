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


bot.on('message', msg => {
    let cmd = new Cmd(msg);
    cmd.parseBang();
    cmd.parseSmallTalk();
});
bot.login(auth.token)
