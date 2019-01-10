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
        this.roles = (message.member)? message.member.roles:null;
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
    //Returns specified role of member if member contains it
    checkRole(role) {
        return this.roles.find(r => r.name === role);
    }
    parseInput() {
        if(this.content[0] == '!') {
            let cmd = this.content.substring(1).split(' ')[0];
            if(this.cmdExists(cmd)) {
                let args = this.content.substring(1+cmd.length+1).toLowerCase().split(', ');
                if(this.checkChannel(cmd)){
                    this.fetchCommand(cmd, args);
                }
                else {
                    this.reply(this.wrongChannel(cmd));
                }
            }
            else {
                this.reply(cmdList.invalid.help);
            }
        }
    }
    //Returns whether command is being used in proper channel type
    checkChannel(cmd) {
        for(let i = 0; i < cmdList[cmd].channels.length; i++) {
            if(this.ch_type == cmdList[cmd].channels[i]) {
                return true;
            }
        }
        return false;
    }
    wrongChannel(cmd) {
        let out = 'That command can only be used in:\n';
        for(let i = 0; i < cmdList[cmd].channels.length; i++) {
            let tmp = cmdList[cmd].channels[i];
            out += (tmp == "text")? "server":tmp;
            out += ' channels';
            out += (i != cmdList[cmd].channels.length - 1)? ', ':'';
        }
        return out;
    }
    hasPermission(cmd, channel) {
        if(this.channel == "text") {
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
    cmdExists(cmd) {
        for(let c in cmdList) {
            if(c == cmd) {
                return true;
            }
        }
        return false
    }
    fetchCommand(cmd, args) {
        if(this.hasPermission(cmd,this.ch_type)) {
            switch(cmd) {
                case "help": this.cmdHelp((args[0])? args[0] : cmd); break;
                case "addlink": this.cmdAddLink(args); break;
                case "getlink": this.cmdGetLink(args[0]); break;
                case "deletelink": this.cmdDeleteLink(args[0]); break;
                case "deletelast": this.cmdDeleteLast(); break;
                case "findlinks": this.cmdFindLinks(args); break;
                default: this.sendMessage(cmdList["invalid"].help); break;
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
    //          -arg1 information
    //          -arg2 information
    //          ...
    //          You can use these commands here:
    //          !help, !cmd1, !cmd2, !cmd3...
    cmdHelp(cmd) {
        let out = ["Usage of this command:"];
        for(let i = 0; i < cmdList[cmd].help.length; i++) {
            out.push(cmdList[cmd].help[i]);
        }
        let list = ((cmd == 'help')? this.getCmdList():this.getRolesList(cmd));
        for(let l in list) {
            out.push(list[l]);
        }
        this.sendMessage(out);
    }
    getCmdList() {
        let out = ['You can use these commands here:'];
        let cmds = [];
        for(let c in cmdList) {
            if(c != "invalid" && cmdList[c].channels.includes(this.ch_type)) {
                cmds.push(c);
            }
        }
        for(let c in cmds) {
            cmds[c] = '`!' + cmds[c] + '`';
        }
        out.push(cmds);
        return out;
    }
    getRolesList(cmd) {
        if(cmdList[cmd].roles.length > 0) {
            let out = ['You must have one of these roles to use this command:'];
            if(cmdList[cmd].channels.includes('text') && this.ch_type == 'text') {
                let roles = [];
                for(let r in cmdList[cmd].roles) {
                    roles[r] = ('`' + cmdList[cmd].roles[r] + '`');
                }
                out.push(roles.toString());
            }
            return out;
        }
        return null;
    }
    //Addlink command will add a new link to a list of links associated
    //with a name in an xml doc
    //Example:  !addlink meme https://dank.meme
    //          Your link has been added!
    cmdAddLink(args) {
        if(args.length >= 3) {
            let cmd = cmdList.addlink;
            let link = args[0];
            let name = args[1].toLowerCase();
            let tags = [];
            for(let i = 2; i < args.length; i++) {
                tags.push(args[i].toLowerCase());
            }
            if(link.substring(0,4) == "http") {
                let flags = this.db.add(name, link, tags);
                if(!flags.overwrite) {
                    this.reply(cmd.confirm.added);
                }
                else {
                    this.reply(cmd.confirm.overwrite);
                }
            }
            else {
                this.reply(cmd.errors.badlink);
            }
        }
        else {
            this.reply(cmd.errors.missingarg);
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
                this.reply(cmdList.getlink.errors.notfound);
            }
        }
        else {
            this.reply(cmdList.getlink.errors.noinput);
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
    //Searches database for links containing specified list of tags. This function
    //will only return links that contain all specified tags
    //Example:  !findlinks tag1, tag2, tag3
    //          link 1: https://a-link
    //          link 2: https://b-link
    cmdFindLinks(tags) {
        let links = {};
        let out = '';
        if(tags) {
            links = this.db.find(tags);
            for(let key in links) {
                out += key;
                out += ': [';
                out += links[key].data;
                out += ']\n'
            }
            if(out.length > 0) {
                this.sendMessage(out);
            }
            else {
                this.sendMessage('No links found for tags:' + tags.toString());
            }
        }
        else {
            this.reply('You must enter at least 1 tag to search.');
        }
    }
}
