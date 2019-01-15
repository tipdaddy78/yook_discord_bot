const EventEmitter = require('events');
const Database = require('./Database/Database.js');
const Commands = require('./Commands/Commands.js');
const Fetch = require('./Commands/CommandFetcher.js');
const logger = require('./Logger.js');

//Node.js export for use in other scripts
//Cmd class contains functions that are crucial for bot commands
module.exports = class CmdParser extends EventEmitter {
    //All classes must have a constructor, a default will be used if not called
    //exclusively
    constructor()
    {
        super();
        this.db = new Database();
    }
    set data(msg)
    {
        this.msg = msg;
        this.usr = msg.author;
        this.username = msg.author.username;
        this.roles = (msg.member)? msg.member.roles:null;
        this.channel = msg.channel;
        this.ch_type = msg.channel.type;
    }
    get data()
    {
        let d =
        {
            msg:this.msg,
            usr:this.usr,
            username:this.username,
            roles:this.roles,
            channel:this.channel,
            ch_type:this.ch_type,
            cmd:this.cmd,
            opt:this.opt,
            args:this.args
        }
        return d;
    }
    set args(a)
    {
        this.arg_list = {};
        this.arg_list.cmd = [];
        let cmd = a.toLowerCase().split(' ')[0];
        for(let c of Commands.list())
        {
            if(cmd.includes(c))
            {
                this.arg_list.cmd.push(cmd.substring(1,c.length));
                if(cmd.length > c.length)
                {
                    this.arg_list.cmd.push(cmd.substring(c.length));
                }
            }
        }
        if(a.trim().includes(' '))
        {
            this.arg_list.args = a.substring(a.indexOf(' ')+1).toLowerCase().split(',');
            for(let a in this.arg_list.args)
            {
                this.arg_list.args[a] = this.arg_list.args[a].trim();
            }
        }
        else
        {
            this.arg_list.args = [];
            logger.info('No arguments')
        }
    }
    get args()
    {
        return this.arg_list.args;
    }
    get cmd()
    {
        return this.arg_list.cmd[0];
    }
    get opt()
    {
        return this.arg_list.cmd[1];
    }
    set input(msg)
    {
        this.data = msg;
        if(msg.content[0]=='!')
        {
            this.args = msg.content;
            this.fetchCommand(this.cmd, this.opt, this.args);
        }
    }
    fetchCommand(cmd, opt, args)
    {
        switch(cmd)
        {
            case "help": Fetch.help(this, args[0]); break;
            case "find":Fetch.find(this, opt, args); break;
            case "delete":Fetch.delete(this, opt, args); break;
            case "add":Fetch.add(this,opt,args); break;
            case "get":Fetch.get(this,opt,args[0]); break;
        }
    }
    //Returns specified role of member if member contains it
    checkRole(role)
    {
        return this.roles.find(r => r.name === role);
    }
    //Returns whether command is being used in proper channel type
    checkChannel(cmd)
    {
        return cmd.channels.includes(this.ch_type);
    }
    hasPermission(cmd)
    {
        if(cmd.roles.length > 0)
        {
            for(let r of cmd.roles)
            {
                if(this.checkRole(r))
                {
                    return true;
                }
            }
            return false;
        }
        return true;
    }
}
