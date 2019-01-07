const Discord = require('discord.js');
const links = require('/links.xml');

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
        this.cmd_list = [
                            "ping",
                            "me",
                            "wakeup",
                            "shutup",
                            "checkmod",
                            "help",
                            "commandlist",
                            "addlink"
                        ];
        this.bIsAwake = false;
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
                //Wakeup command will change bIsAwake value to true and send a confirmation
                //message back to current user if a mod, otherwise it won't change bIsAwake
                //Example:  !wakeup
                //          I'm awake!
                case 2: this.cmdWakeUp(); break;
                //Shutup command will change bIsAwake value to false and send a confirmation
                //message back to current user if a mod, otherwise it won't change bIsAwake
                //Example:  !shutup
                //          DON'T TELL ME WHAT TO DO!
                case 3: this.cmdShutUp(); break;
                //Checkmod command will check if specified user has "Mods" role. If no user
                //is specified, it will check current user
                //Example:  !checkmod user
                //          user is not a mod.
                case 4: this.cmdCheckMod(args[1]); break;
                //Help command will provide information for specified commands.
                //Example:  !help
                //          @user !help [cmd]
                //          !help cmd
                //          @user !cmd [arg1] [arg2]... [argN]
                case 5: this.cmdHelp(args[1]); break;
                case 6: this.cmdCommandList(); break;
                case 7: this.cmdAddLink(args[1], args[2]);
                default: this.cmdInvalid(); break;
            }
        }
    }
    parseSmallTalk() {
        //INEPT_bot insult replies. INEPT_bot will take input strings and return
        //some output that sounds similar
        if (this.bIsAwake){

        }
    }

    cmdPing(user){
        if(user) {
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

    cmdWakeUp() {
        if(this.isMod(this.username)) {
            this.bIsAwake = true;
            this.reply('I\'m awake!');
        }
        else {
            this.reply('YOU HAVE NO AUTHORITAH!');
        }
    }

    cmdShutUp() {
        if(this.isMod(this.username)) {
            this.bIsAwake = false;
            this.reply('DON\'T TELL ME WHAT TO DO!');
        }
        else {
            this.reply('YOU SHUTUP PLEB!');
        }
    }

    cmdCheckMod(user) {
        if(user) {
            if(this.getMember(user)) {
                this.sendMessage(user
                    + (this.isMod(user)? ' is' : ' is not')
                    + ' a mod');
            }
            else {
                this.reply('No user by that name in this server!');
            }
        }
        else {
            this.reply('You '
                + (this.isMod(this.username)? 'are' : 'are not')
                + ' a mod');
        }
    }

    cmdHelp(cmd) {
        if(cmd) {
            switch(this.cmd_list.indexOf(cmd)) {
                case 0: this.reply(' !ping [username/optional]'); break;
                case 1: this.reply(' me takes no arguments.'); break;
                case 2: this.reply(' wakeup takes no arguments'); break;
                case 3: this.reply(' shutup takes no arguments'); break;
                case 4: this.reply(' !checkmod [username/optional]'); break;
                case 5: this.reply(' !help [command/required]'); break;
                case 6: this.reply(' commandlist takes no arguments'); break;
                case 7: this.reply(' !addlink [name/required] [link/required]'); break;
            }
        }
        else {
            this.reply(' !help [command/required]');
        }
    }

    cmdCommandList() {
        this.reply(this.cmd_list.toString());
    }

    cmdAddLink(name, link) {
        if(name && link) {

            this.reply('Link added!');
        }
        else {
            this.reply('Please provide both a name and link!');
        }
    }

    cmdInvalid() {
        this.reply('I don\'t know that one!');
    }
}
