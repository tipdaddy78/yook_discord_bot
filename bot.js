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

//Functions for use in command procedures
//
//Sends message to current channel
function sendMessage(msg_obj, content) {
    msg_obj.channel.send(content);
}

//Returns username of current user
function getUsername(msg) {
    return msg.author.username;
}

//Finds and returns GuildMember of specified username
function getMember(guild, username) {
    return guild.members.find(m => m.displayName === username);
}

//Checks if member has "Mods" role
function checkRole(member, role) {
    return member.roles.find(r => r.name === role);
}

//Checks if specified user in guild is a mod
function isMod(msg, username) {
    return checkRole(getMember(msg.guild, username), "Mods");
}

//Generates text to mention specified user in a message
function mention(userid) {
    var out = ' ';
    out += '<';
    out += '@';
    out += userid;
    out += '>';
    return out;
}

var commands = ["ping", "me", "wakeup", "shutup", "checkmod"];
var bIsAwake = false;
bot.on('message', msg => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (msg.content[0] == '!') {
        var args = msg.content.substring(1).split(' ');
        var cmd = args[0];
        switch(commands.indexOf(cmd)) {
            // !ping
            case 0:
                if(args.length > 1){
                    var member = getMember(msg.guild, args[1]);
                    if(member) {
                        sendMessage(msg, 'Yo' + mention(member.user.id) + '!');
                    }
                    else {
                        msg.reply('No user by that name in this channel!');
                    }
                }
                else {
                    msg.reply('Pong!');
                }
            break;
            case 1:
                sendMessage(msg, getUsername(msg));
            break;

            case 2:
                bIsAwake = true;
                msg.reply('I\'m awake!');
            break;

            case 3:
                bIsAwake = false;
                msg.reply('DON\'T TELL ME WHAT TO DO!')
            break;

            case 4:
                if(args.length > 1) {
                    if(getMember(msg.guild, args[1])) {
                        if(isMod(msg, args[1])) {
                            sendMessage(msg, args[1] + ' is a mod.');
                        }
                        else {
                            sendMessage(msg, args[1] + ' is not a mod.');
                        }
                    }
                    else {
                        msg.reply('No user by that name in this channel!');
                    }
                }
                else {
                    if(isMod(msg, getUsername(msg))) {
                        msg.reply('You are a mod');
                    }
                    else {
                        msg.reply('You are not a mod');
                    }
                }
            break;
        }
    }
    //INEPT_bot insult replies. INEPT_bot will take input strings and return
    //some output that sounds similar
    if (bIsAwake){

    }
});
bot.login(auth.token)
