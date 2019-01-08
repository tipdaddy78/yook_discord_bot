const Discord = require('discord.js');
const Bot = require('./bot.js');
const Database = require('./database.js');
var linksDB = require('./links.json');

//Node.js export for use in other scripts
//Cmd class contains functions that are crucial for bot commands
module.exports = class Cmd {
    //All classes must have a constructor, a default will be used if not called
    //exclusively
    constructor(message){
        this.content = message.content;
        this.username = message.author.username;
        this.member = message.member;
        this.guild = message.guild;
        this.channel = message.channel;
        this.cmd_list = [
            "ping",
            "me",
            "help",
            "commands",
            "addlink",
            "getlink",
            "deletelink",
            "deletelast"
        ];
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
    //Returns specified role of member if member contains it
    checkRole(name, role) {
        return this.getMember(name).roles.find(r => r.name === role);
    }
    //Returns "Mods" if specified user has this role, returns null otherwise
    isMod(name) {
        return this.checkRole(name, "Mods");
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
    parseBang() {
        if(this.content[0] == '!') {
            let args = this.content.substring(1).split(' ');
            switch(this.cmd_list.indexOf(args[0])) {
                //Ping will mention specified user with "Yo", if no user is specified
                //ping will simply mention current user with "Pong!"
                //Example:  !ping
                //          @user, Pong!
                //          !ping user
                //          Yo @user
                case 0: this.cmdPing(args[1]); break;
                //Me command will just send a message to current channel with current user's
                //name
                //Example:  !me
                //          yourname
                case 1: this.cmdMe(); break;
                //Help command will provide information for specified commands.
                //Example:  !help
                //          @user !help [cmd]
                //          !help cmd
                //          @user !cmd [arg1] [arg2]... [argN]
                case 2: this.cmdHelp(args[1]); break;
                //Commandlist will send a reply to current user with the full list
                //of available commands
                //Example:  !commandlist
                //          @user, ping, me, wakeup, shutup, checkmod, help
                case 3: this.cmdCommands(); break;
                //Addlink command will add a new link to a list of links associated
                //with a name in an xml doc
                //Example:  !addlink meme https://dank.meme
                //          Your link has been added!
                case 4: this.cmdAddLink(args[1], args[2]); break;
                //Getlink command will reply to user the exact link with the specified
                //key/name provided in argument list
                //Example:  !getlink meme
                //          @user, https://dank.meme
                case 5: this.cmdGetLink(args[1]); break;
                //Deletelink command deletes the link with specified name in the
                //links.json file
                //Example:  !deletelink meme
                //          @user, Successfully deleted link.
                case 6: this.cmdDeleteLink(args[1]); break;
                //Deletelast command deletes last link in the links.json file
                //Example:  !deletelast
                //          @user, Successfully deleted last link.
                case 7: this.cmdDeleteLast(); break;
                //Invalid command will be used if user tries to input any
                //command that isn't in the command list
                //Example:  !potato
                //          I don't know that one!
                default: this.cmdInvalid(); break;
            }
        }
    }

    cmdPing(user){
        if(user && this.isMod(this.username)) {
            if(this.getMember(user)) {
                let userid = this.getUserId(user);
                this.sendMessage('Yo' + this.mention(userid) + '!');
            }
            else {
                this.reply('No user by that name in this server!');
            }
        }
        else {
            this.reply('Pong!');
        }
    }

    cmdMe() {
        this.sendMessage(this.username);
    }

    cmdHelp(cmd) {
        if(cmd) {
            switch(this.cmd_list.indexOf(cmd)) {
                case 0: this.reply(' ping takes no arguments'); break;
                case 1: this.reply(' me takes no arguments.'); break;
                case 2: this.reply(' !help [command/required]'); break;
                case 3: this.reply(' commands takes no arguments'); break;
                case 4: this.reply(' !addlink [name/required] [link/required]'); break;
                case 5: this.reply(' !getlink [name/required]'); break;
                case 6: this.reply(' !deletelink [name/required]'); break;
                case 7: this.reply(' deletelast takes no arguments'); break;
                default: this.reply(' I don\'t recognize that command, sorry, can\'t help!'); break;
            }
        }
        else {
            this.reply(' !help [command/required]');
        }
    }

    cmdCommands() {
        if(this.isMod(this.username)) {
            let out = '\n';
            for(let c of this.cmd_list) {
                if(c) {
                    out += ' ';
                    out += c;
                    out += ',';
                    out += '\n';
                }
            }
            this.reply(out);
        }
        else {
            this.reply('You don\'t have permission to use this command, ask a mod!');
        }
    }

    cmdAddLink(name, link) {
        if(this.isMod(this.username)) {
            if(name && link) {
                this.db.add(name, link);
                this.reply('Link added!');
            }
            else {
                this.reply('Please provide both a name and link!');
            }
        }
        else {
            this.reply('This command can only be used by mods!');
        }
    }

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
            this.reply('Please enter the name of the link, must have no spaces');
        }
    }

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
                this.reply('Please enter the name of the link, must have no spaces');
            }
        }
        else {
            this.reply('This command can only be used by mods!');
        }
    }

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

    cmdInvalid() {
        this.reply('I don\'t know that one!');
    }
}
