const Discord = require('discord.js');

//Node.js export for use in other scripts
//Cmd class contains functions that are crucial for bot commands
module.exports = class Cmd {
    //All classes must have a constructor, a default will be used if not called
    //exclusively
    constructor(message){
        this.msg = message;
        this.username = message.author.username;
        this.member = message.member;
        this.guild = message.guild;
        this.channel = message.channel;
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
    checkRole(member, role) {
        return member.roles.find(r => r.name === role);
    }
    //Returns "Mods" if specified user has this role, returns null otherwise
    isMod(name) {
        return this.checkRole(this.getMember(name), "Mods");
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
    //Method for !ping command
    //This mentions a specified user, or current user if none are specified
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
            this.reply('I\'m awake!');
            return true;
        }
        else {
            this.reply('YOU HAVE NO AUTHORITAH!');
            return null;
        }
    }

    cmdShutUp() {
        if(this.isMod(this.username)) {
            this.reply('DON\'T TELL ME WHAT TO DO!');
            return false;
        }
        else {
            this.reply('YOU SHUTUP PLEB!');
            return null;
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
                this.reply('No user by that name in this channel!');
            }
        }
        else {
            this.reply('You '
                + (this.isMod(this.username)? 'are' : 'are not')
                + ' a mod');
        }
    }
}
