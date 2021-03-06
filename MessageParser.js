const EventEmitter = require('events');
const Commands = require('./Commands/Commands.js');
const CmdAdd = require('./Commands/CmdAdd.js');
const CmdHelp = require('./Commands/CmdHelp.js');
const CmdDelete = require('./Commands/CmdDelete.js');
const CmdFind = require('./Commands/CmdFind.js');
const CmdGet = require('./Commands/CmdGet.js');
const logger = require('./Logger.js');

//Node.js export for use in other scripts
//Cmd class contains functions that are crucial for bot commands
module.exports = class MessageParser extends EventEmitter {
    //All classes must have a constructor, a default will be used if not called
    //exclusively
    constructor()
    {
        super();
    }
    set(msg)
    {
        this.data = msg;
        this.arg_list = {cmd:'',opt:'',args:[]};
        this.cmd = msg.content.match(/^!([a-z]+\b)/i)[1];
        this.args = msg.content.trim();
    }
    set data(msg)
    {
        this.msg = msg;
        this.usr = msg.author;
        this.username = msg.author.username;
        this.roles = (msg.member)? msg.member.roles:[];
        this.channel = msg.channel;
        this.ch_type = msg.channel.type;
    }
    get data()
    {
        return {
            msg:this.msg,
            usr:this.usr,
            username:this.username,
            roles:this.roles,
            channel:this.channel,
            ch_type:this.ch_type,
            cmd:this.cmd
        };
    }
    set args(args)
    {
        let i = args.indexOf(' ')+1;
        if(i > 0)
        {
            this.arg_list.args = args.substring(i).split(',').map(s=>s.trim());
        }
    }
    get args()
    {
        return this.arg_list.args;
    }
    set cmd(cmd)
    {
        this.arg_list.cmd = Commands.list().find(c => cmd.startsWith(c));
        this.opt =  this.arg_list.cmd?
                    cmd.length != this.arg_list.cmd.length?
                    cmd.substring(this.arg_list.cmd.length) : '' : '';
    }
    get cmd()
    {
        return this.arg_list.cmd;
    }
    set opt(opt_str)
    {
        this.arg_list.opt = opt_str;
    }
    get opt()
    {
        return this.arg_list.opt;
    }
    isCommand(char)
    {
        return char==='!';
    }
    command()
    {
        switch(this.cmd)
        {
            case "help":
            return new CmdHelp(this.args[0]);
            case "find":
            return new CmdFind(this.args);
            case "delete":
            return new CmdDelete(this.username, this.args[0], this.args[1]);
            case "add":
            return new CmdAdd(this.args, this.username);
            case "get":
            return new CmdGet(this.args[0]);
        }
        return null;
    }
    execute(cmd)
    {
        if(cmd)
        {
            let data = {data:this.data,ch:'ch'};
            if(cmd.channels.includes(this.ch_type))
            {
                if(this.ch_type == 'dm'
                || this.roles.some(r => cmd.roles.includes(r.name)))
                {
                    let output = cmd.execute(this.opt);
                    data.ch = output.ch;
                    data.out = output.msg;
                }
                else
                {
                    logger.info(`Access denied`);
                    data.out = cmd.message('nopermit');
                }
            }
            else
            {
                data.out = cmd.message('nopermit');
            }
            this.emit('cmd', data);
        }
    }
}
