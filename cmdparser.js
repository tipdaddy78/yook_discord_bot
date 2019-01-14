const EventEmitter = require('events');
const Database = require('./database.js');
const Fetch = require('./fetch.js');
const Parse = require('./parsehelper.js');
const logger = require('./logger.js');
var linksDB = require('./links.json');
// var Fetch = Commands.Fetch;

//Node.js export for use in other scripts
//Cmd class contains functions that are crucial for bot commands
module.exports = class CmdParser extends EventEmitter {
    //All classes must have a constructor, a default will be used if not called
    //exclusively
    constructor()
    {
        super();
        this.db = new Database('./links.json', linksDB);
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
        this.arg_list['cmd'] = a.substring(1).split(' ')[0].toLowerCase().split('-');
        if(a.trim().includes(' '))
        {
            this.arg_list['args'] = a.substring(a.indexOf(' ')+1).toLowerCase().split(',');
            for(let a in this.arg_list['args'])
            {
                this.arg_list['args'][a] = this.arg_list['args'][a].trim();
            }
        }
        else
        {
            this.arg_list['args'] = [];
            logger.info('No arguments')
        }
    }
    get args()
    {
        return this.arg_list['args'];
    }
    get cmd()
    {
        return this.arg_list['cmd'][0];
    }
    get opt()
    {
        return this.arg_list['cmd'][1];
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
