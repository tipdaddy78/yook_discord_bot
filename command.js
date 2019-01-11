const Discord = require('discord.js');
const Bot = require('./bot.js');
const Database = require('./database.js');
const logger = require('winston');
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
        this.usr = message.author;
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
    //Sends DM to user
    sendDM(content) {
        return this.usr.send(content);
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
            let symbols = "!@#$%^&*-_+=|?({[<>]}):;\"\'";
            let cmd = this.content.substring(1).split(' ')[0];
            if(this.cmdExists(cmd)) {
                if(this.checkChannel(cmd)){
                    let args = this.content.substring(1+cmd.length+1).toLowerCase().split(', ');
                    for(let a in args) {
                        if(symbols.includes(args[a][0])) {
                            args[a] = symbols.includes(args[a][1])? args[a].substring(2):args[a].substring(1);
                        }
                        args[a] = args[a].trim();
                    }
                    logger.log('info', this.username + ' has used !' + cmd);
                    this.fetchCommand(cmd, args);
                }
            }
        }
    }
    //Returns whether command is being used in proper channel type
    checkChannel(cmd) {
        for(let ch in cmdList[cmd].channels) {
            if(this.ch_type == cmdList[cmd].channels[ch]) {
                return true;
            }
        }
        logger.log('info', 'Wrong channel type for command');
        return false;
    }
    hasPermission(cmd) {
        if(this.ch_type == 'text') {
            if(cmdList[cmd].roles.length > 0) {
                for(let r in cmdList[cmd].roles) {
                    if(this.checkRole(cmdList[cmd].roles[r])) {
                        return true;
                    }
                }
                this.sendMessage(this.getRolesList(cmd));
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
        logger.log('info', 'Command not found: ' + cmd);
        return false
    }
    fetchCommand(cmd, args) {
        if(this.hasPermission(cmd)) {
            switch(cmd) {
                case "help": this.cmdHelp(args[0]); break;
                case "addlink": this.cmdAddLink(args); break;
                case "getlink": this.cmdGetLink(args[0]); break;
                case "deletelink": this.cmdDeleteLink(args[0]); break;
                case "deletelast": this.cmdDeleteLast(); break;
                case "findlinks": this.cmdFindLinks(args); break;
                case "filterlinks": this.cmdFilterLinks(args); break;
                case "showall": this.cmdShowAll(args); break;
                default: this.cmdHelp("invalid"); break;
            }
        }
        else {
            logger.log('info', this.username + ' does not have permission to use !' + cmd);
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
    cmdHelp(cmd_in) {
        let cmd = cmdList.hasOwnProperty(cmd_in)? cmd_in:'help';
        let out = this.getHelpOutput(cmd);
        out.push(this.getChannelsList(cmd));
        out.push(this.getRolesList(cmd));
        out.push(this.getCmdList());
        this.sendDM(out);
    }
    getHelpOutput(cmd) {
        let out = ["Usage of this command:"];
        for(let i = 0; i < cmdList[cmd].help.length; i++) {
            out.push(cmdList[cmd].help[i]);
        }
        return out;
    }
    getCmdList() {
        let out = 'Commands list:\n';
        let cmds = [];
        for(let c in cmdList) {
            if(c != "invalid") {
                cmds.push('!' + c);
            }
        }
        out += '`' + cmds.toString() + '`';
        return out;
    }
    getRolesList(cmd) {
        if(cmdList[cmd].roles.length > 0) {
            let out = 'You must have one of these roles to use this command:\n';
            let roles = [];
            for(let r in cmdList[cmd].roles) {
                roles[r] = cmdList[cmd].roles[r];
            }
            out += '`' + roles.toString() + '`';
            return out;
        }
        return null;
    }
    getChannelsList(cmd) {
        let out = 'This command can be used in:\n';
        let channels = [];
        for(let ch in cmdList[cmd].channels) {
            channels[ch] = cmdList[cmd].channels[ch];
            out += ((channels[ch]=='text')? 'server':channels[ch]) + ' channels';
            out += (ch==cmdList[cmd].channels.length - 1)? '':', ';
        }
        return out;
    }
    //Addlink command will add a new link to a list of links associated
    //with a name in an xml doc
    //Example:  !addlink meme https://dank.meme
    //          Your link has been added!
    cmdAddLink(args) {
        if(args.length >= 3) {
            let link = args[0];
            let name = args[1].toLowerCase();
            let tags = [];
            let op = this.username;
            for(let i = 2; i < args.length; i++) {
                tags.push(args[i].toLowerCase());
            }
            if(link.substring(0,4) == "http") {
                let flags = this.db.addEntry(name,{"data":link,"tags":tags,"op":op});
                if(!flags.exists) {
                    this.reply(cmdList.addlink.confirm.added);
                }
                else {
                    if(this.db.getEntry(name).op == op) {
                        this.reply(cmdList.addlink.confirm.overwrite);
                    }
                    else {
                        this.reply(cmdList.addlink.errors.noedit);
                    }
                }
            }
            else {
                this.reply(cmdList.addlink.errors.badlink);
            }
        }
        else {
            this.reply(cmdList.addlink.errors.missingarg);
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
                this.reply(cmdList.deletelink.confirm);
            }
            else {
                this.reply(cmdList.deletelink.errors.notfound);
            }
        }
        else {
            this.reply(cmdList.deletelink.errors.noinput);
        }
    }
    //Deletelast command deletes last link in the links.json file
    //Example:  !deletelast
    //          @user, Successfully deleted last link.
    cmdDeleteLast() {
        let d = this.db.deleteLast();
        if(d) {
            this.reply(cmdList.deletelast.confirm);
        }
        else {
            this.reply(cmdList.deletelast.errors.nolinks);
        }
    }
    //Searches database for links containing ANY of the specified tags. This function
    //will only return links that contain all specified tags
    //Example:  !findlinks tag1, tag2, tag3
    //          link 1: https://a-link
    //          link 2: https://b-link
    cmdFindLinks(tags) {
        if(tags) {
            let links = this.db.find(tags);
            let out = this.parseLinks(links);
            if(out.length > 0) {
                out.sort();
                this.sendMessage(out);
            }
            else {
                this.sendMessage(cmdList.findlinks.errors.nolinks);
            }
        }
        else {
            this.reply(cmdList.findlinks.errors.notags);
        }
    }
    //Searches database for links containing ALL of the specified tags. This function
    //will only return links that contain all specified tags
    //Example:  !findlinks tag1, tag2, tag3
    //          link 1: https://a-link
    //          link 2: https://b-link
    cmdFilterLinks(tags) {
        if(tags) {
            let links = this.db.filter(tags);
            let out = this.parseLinks(links);
            if(out.length > 0) {
                out.sort();
                this.sendMessage(out);
            }
            else {
                this.sendMessage(cmdList.filterlinks.errors.nolinks);
            }
        }
        else {
            this.reply(cmdList.filterlinks.errors.notags);
        }
    }
    parseLinks(links) {
        let out = [];
        for(let key in links) {
            out.push('[' + key + '](' + links[key].data
                + ') Posted by ' + links[key].op
                + '\ntags: ' + links[key].tags);
        }
        return out;
    }
    cmdShowAll(attribute) {
        let data = this.db.getAll();
        let out = [];
        if(attribute == 'links') {
            out = this.parseLinks(data);
            out.sort();
        }
        else if (attribute == 'tags') {
            for(let key in data) {
                for(let t in data[key].tags) {
                    if(!out.includes(data[key].tags[t])) {
                        out.push(data[key].tags[t]);
                    }
                }
            }
            out.sort();
        }
        else {
            this.cmdHelp("showall");
            return false;
        }
        this.sendMessage((out.length > 0)? out:cmdList.showall.errors.nodata);
        return true;
    }
}
