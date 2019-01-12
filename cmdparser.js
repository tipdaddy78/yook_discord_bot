const EventEmitter = require('events');
const Database = require('./database.js');
const Fetch = require('./commands.js');
const Parse = require('./parsehelper.js');
const logger = require('winston');
var linksDB = require('./links.json');

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
        this.content = msg.content;
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
            "msg":this.msg,
            "usr":this.usr,
            "username":this.username,
            "roles":this.roles,
            "channel":this.channel,
            "ch_type":this.ch_type
        }
        return d;
    }
    set cmd(c)
    {
        this.command = c.substring(1, c.indexOf(' '));
    }
    get cmd()
    {
        return this.command;
    }
    set args(a)
    {
        this.arg_list = a.substring(a.indexOf(' ')).toLowerCase().split(',');
        for(let i in this.arg_list)
        {
            this.arg_list[i] = this.arg_list[i].trim();
        }
    }
    get args()
    {
        return this.arg_list;
    }
    fetchCommand(cmd, args)
    {
        switch(cmd)
        {
            case "help": Fetch.help(this, args[0]); break;
            case "addlink": Fetch.addLink(this, args); break;
            case "getlink": Fetch.getLink(this, args[0]); break;
            case "deletelink": Fetch.deleteLink(this, args[0]); break;
            case "deletelast": Fetch.deleteLast(this); break;
            case "findlinks": Fetch.findLinks(this, args); break;
            case "filterlinks": Fetch.filterLinks(this, args); break;
            case "showall": Fetch.showAll(this, args[0]); break;
        }
    }
    parseInput()
    {
        if(this.content[0] == '!')
        {
            this.cmd = this.content;
            this.args = this.content;
            this.fetchCommand(this.cmd, this.args);
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
