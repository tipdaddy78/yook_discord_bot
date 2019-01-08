const Discord = require('discord.js');
const Bot = require('./bot.js');
const Database = require('./database.js');
var linksDB = require('./links.json');
var cmdList = require('./commands.json');

//Node.js export for use in other scripts
//Cmd class contains functions that are crucial for bot commands
module.exports = class Cmd {
    //All classes must have a constructor, a default will be used if not called
    //exclusively
    constructor(message){
        this.msg = message;
        this.content = message.content;
        this.username = message.author.username;
        this.member = message.member;
        this.guild = message.guild;
        this.channel = message.channel;
        this.ch_type = message.channel.type;
        this.db = new Database('./links.json', linksDB);
    }
    //Sends a message through current channel
    sendMessage(content) {
        return this.channel.send(content);
    }
    //Sends a reply to current user
    reply(content) {
        return this.msg.reply(content);
    }
    //Returns specified GuildMember by username
    getMember(name) {
        return this.guild.members.find(m => m.displayName === name);
    }
    //Returns userid of specified user in guild
    getUserId(name) {
        return this.getMember(name).user.id;
    }
    //Returns whether command is being used in proper channel type
    checkChannel(cmd) {
        for(let ch in cmdList[cmd].channel) {
            if(this.ch_type == ch){
                return true;
            }
        }
        return false;
    }
    //Returns specified role of member if member contains it
    checkRole(role) {
        return this.member.roles.find(r => r.name === role);
    }
    //Generates mention string with specified userid
    mention(userid) {
        let out = ' ';
        out += '<';
        out += '@';
        out += userid;
        out += '>';
        return out;
    }
    parseInput() {
        if(this.content[0] == '!') {
            let args = this.content.substring(1).split(' ');
            let cmd = (args[0])? args[0] : "invalid";
            if(this.checkChannel(cmd)){
                if(this.hasPermission(cmd,this.ch_type)) {
                    fetchCommand(cmd, [args[1], args[2]]);
                }
                else {
                    this.reply('You must be: '
                    + cmdList[cmd].roles.toString())
                }
            }
            else {
                let out = 'That command can only be used in a:\n';
                for(let ch in cmdList[cmd].channel) {
                    switch(ch){
                        case "dm": out += 'DM'; break;
                        case "text": out += 'Channel'; break;
                    }
                    out += ', ';
                }
                this.reply(out);
            }
        }
    }
    hasPermission(cmd, channel) {
        if(channel == "text") {
            if(cmdList[cmd].roles) {
                for(let r in cmdList[cmd].roles) {
                    if(this.checkRole(r)) {
                        return true;
                    }
                }
                return false;
            }
        }
        return true;
    }
    fetchCommand(cmd, args) {
        switch(cmd) {
            case "help":
            this.cmdHelp((args[1])? args[1] : cmd);
            break;
            case "commands":
            this.cmdCommands();
            break;
            case "addlink":
            this.cmdAddLink(args[1], args[2]);
            break;
            case "getlink":
            this.cmdGetLink(args[1]);
            break;
            case "deletelink":
            this.cmdDeleteLink(args[1]);
            break;
            case "deletelast":
            this.cmdDeleteLast();
            break;
            default:
            this.sendMessage(cmdList["invalid"].help);
            break;
        }
    }
    //Help command will provide information for specified commands.
    //Example:  !help
    //          @user !help [cmd]
    //          !help cmd
    //          @user !cmd [arg1] [arg2]... [argN]
    cmdHelp(cmd) {
        if(cmd) {
            this.sendMessage(cmdList[cmd].help);
        }
        else {
            this.sendMessage('Usage: !help <command>');
        }
    }
    //Commandlist will send a reply to current user with the full list
    //of available commands
    //Example:  !commandlist
    //          @user, ping, me, wakeup, shutup, checkmod, help
    cmdCommands() {
        if(this.isMod(this.username)) {
            let out = '';
            for(let c in cmdList) {
                if(c != "invalid") {
                        out += '!' + c ;
                        out += ',' + ' ';
                }
            }
            this.reply(out);
        }
        else {
            this.reply('You don\'t have permission to use this command');
        }
    }
    //Addlink command will add a new link to a list of links associated
    //with a name in an xml doc
    //Example:  !addlink meme https://dank.meme
    //          Your link has been added!
    cmdAddLink(name, link) {
        if(this.isMod(this.username)) {
            if(name && link) {
                if(link.substring(0,4) === "http") {
                    this.db.add(name, link);
                    this.reply('Link added!');
                }
                else {
                    this.reply('Only links beginning with http or https allowed!');
                }
            }
            else {
                this.reply('Please provide both a name and link!');
            }
        }
        else {
            this.reply('This command can only be used by mods!');
        }
    }
    //Getlink command will reply to user the exact link with the specified
    //key/name provided in argument list
    //Example:  !getlink meme
    //          @user, https://dank.meme
    cmdGetLink(name) {
        if(name) {
            let link = this.db.get(name);
            if(link) {
                this.reply(link);
            }
            else {
                this.reply('No link with that name.');
            }
        }
        else {
            this.reply('Please enter the name of the link to get');
        }
    }
    //Deletelink command deletes the link with specified name in the
    //links.json file
    //Example:  !deletelink meme
    //          @user, Successfully deleted link.
    cmdDeleteLink(name) {
        if(this.isMod(this.username)) {
            if(name) {
                let d = this.db.delete(name);
                if(d) {
                    this.reply('Successfully deleted link.');
                }
                else {
                    this.reply('No link with that name in database.');
                }
            }
            else {
                this.reply('Please enter the name of the link to delete');
            }
        }
        else {
            this.reply('This command can only be used by mods!');
        }
    }
    //Deletelast command deletes last link in the links.json file
    //Example:  !deletelast
    //          @user, Successfully deleted last link.
    cmdDeleteLast() {
        if(this.isMod(this.username)) {
            let d = this.db.deleteLast();
            if(d) {
                this.reply('Successfully deleted last link.');
            }
            else {
                this.reply('There are no links to delete.');
            }
        }
        else {
            this.reply('This command can only be used by mods!');
        }
    }
}
