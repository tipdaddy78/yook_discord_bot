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
    //Returns whether command is being used in proper channel type
    checkChannel(cmd) {
        let ret = false;
        for(let i = 0; i < cmdList[cmd].channel.length; i++) {
            if(this.ch_type == cmdList[cmd].channel[i]) {
                ret = true;
            }
        }
        return ret;
    }
    //Returns specified role of member if member contains it
    checkRole(role) {
        return this.member.roles.find(r => r.name === role);
    }
    parseInput() {
        if(this.content[0] == '!') {
            let cmd = this.content.substring(1).split(' ')[0];
            cmd = (cmd)? cmd : "invalid";
            let args = this.content.substring(1+cmd.length+1).split(', ');
            if(this.checkChannel(cmd)){
                this.fetchCommand(cmd, args);
            }
            else {
                let out = 'That command can only be used in:\n';
                for(let i = 0; i < cmdList[cmd].channel.length; i++) {
                    let tmp = cmdList[cmd].channel[i];
                    out += (tmp == "text")? "server":tmp;
                    out += ' channels';
                    out += (i != cmdList[cmd].channel.length - 1)? ', ':'';
                }
                this.reply(out);
            }
        }
    }
    hasPermission(cmd, channel) {
        if(channel == "text") {
            if(cmdList[cmd].roles.toString()) {
                for(let i=0; i < cmdList[cmd].roles.length; i++) {
                    if(this.checkRole(cmdList[cmd].roles[i])) {
                        return true;
                    }
                }
                return false;
            }
        }
        return true;
    }
    fetchCommand(cmd, args) {
        if(this.hasPermission(cmd,this.ch_type)) {
            switch(cmd) {
                case "help":
                this.cmdHelp((args[0])? args[0] : cmd);
                break;
                case "commands":
                this.cmdCommands();
                break;
                case "addlink":
                this.cmdAddLink(args);
                break;
                case "getlink":
                this.cmdGetLink(args[0]);
                break;
                case "deletelink":
                this.cmdDeleteLink(args[0]);
                break;
                case "deletelast":
                this.cmdDeleteLast();
                break;
                case "findlinks":
                this.cmdFindLinks((args.length > 0)? args:null);
                break;
                default:
                this.sendMessage(cmdList["invalid"].help);
                break;
            }
        }
        else {
            this.reply('You must be: '
            + cmdList[cmd].roles.toString());
        }
    }
    //Help command will provide information for specified commands.
    //Example:  !help
    //          @user !help [cmd]
    //          !help cmd
    //          @user !cmd [arg1] [arg2]... [argN]
    cmdHelp(cmd) {
        if(cmd) {
            let out = "Usage of this command:\n";
            for(let i = 0; i < cmdList[cmd].help.length; i++) {
                out += cmdList[cmd].help[i];
                out += '\n';
            }
            this.sendMessage(out);
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
        let out = '';
        for(let c in cmdList) {
            if(c != "invalid") {
                    out += '!' + c ;
                    out += ',' + ' ';
            }
        }
        this.reply(out);
    }
    //Addlink command will add a new link to a list of links associated
    //with a name in an xml doc
    //Example:  !addlink meme https://dank.meme
    //          Your link has been added!
    cmdAddLink(args) {
        let link = args[0];
        let name = args[1].toLowerCase();
        let tags = [];
        for(let i = 2; i < args.length; i++) {
            tags.push(args[i].toLowerCase());
        }
        if(name && link && tags.length > 1) {
            if(link.substring(0,4) == "http") {
                this.db.add(name, link, tags);
                this.reply('Link added!');
            }
            else {
                this.reply('Only links beginning with http or https allowed!');
            }
        }
        else {
            this.reply('You must provide a link, name, and at least 1 tag.\n'
            +'Separate arguments by a comma followed by a space: `-arg1, -arg2`');
        }
    }
    //Getlink command will reply to user the exact link with the specified
    //key/name provided in argument list
    //Example:  !getlink meme
    //          @user, https://dank.meme
    cmdGetLink(name) {
        if(name) {
            let out = this.db.get(name);
            if(out) {
                this.reply(out);
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
    //Deletelast command deletes last link in the links.json file
    //Example:  !deletelast
    //          @user, Successfully deleted last link.
    cmdDeleteLast() {
        let d = this.db.deleteLast();
        if(d) {
            this.reply('Successfully deleted last link.');
        }
        else {
            this.reply('There are no links to delete.');
        }
    }
    cmdFindLinks(tags) {
        let links = {};
        let out = '';
        if(tags) {
            links = this.db.find(tags);
            for(let key in links) {
                out += key;
                out += ': <';
                out += links[key].data;
                out += '>\n'
            }
            this.sendMessage(out);
        }
        else {
            this.reply('You must enter at least 1 tag to search.');
        }
    }
}
