const EventEmitter = require('events');
const H = require('./header.js');
const logger = H.Logger;

//Node.js export for use in other scripts
//Cmd class contains functions that are crucial for bot commands
module.exports = class MessageParser extends EventEmitter {
    //All classes must have a constructor, a default will be used if not called
    //exclusively
    constructor()
    {
        super();
    }
    //Master setter function
    //
    //sets all properties of MessageParser object
    set(msg)
    {
        this.data = msg;
        this.arg_list = {cmd:'',opt:'',args:[]};
        this.cmd = msg.content.match(/^!([a-z]+\b)/i)[1];
        this.args = msg.content.trim();
    }
    //collection of data from the DiscordJS Message object necessary for this
    //bot's functions
    set data(msg)
    {
        this.server = msg.guild;
        this.usr = msg.author;
        this.username = msg.author.username;
        this.roles = (msg.member)? msg.member.roles:[];
        this.channel = msg.channel;
        this.ch_type = msg.channel.type;
    }
    get data()
    {
        return {
            usr:this.usr,
            username:this.username,
            roles:this.roles,
            channel:this.channel,
            ch_type:this.ch_type,
            cmd:this.cmd
        };
    }
    //Array of arguments from user message, delineated by commas
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
    //Takes the first word of the message and checks if it begins with a
    //command name, anything after that is added as an option
    set cmd(cmd)
    {
        this.arg_list.cmd = H.Commands.list().find(c => cmd.startsWith(c));
        this.opt =  this.arg_list.cmd?
                    cmd.length != this.arg_list.cmd.length?
                    cmd.substring(this.arg_list.cmd.length) : '' : '';
    }
    get cmd()
    {
        return this.arg_list.cmd;
    }
    //The substring of a command that comes after the name of the command
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
        if(this.server)
            logger.info(`Command sent in ${this.server.name} server`);
        switch(this.cmd)
        {
            case "help":
            return new H.CmdHelp(this.args);
            case "find":
            return new H.CmdFind(this.args);
            case "delete":
            return new H.CmdDelete(this.username, this.args);
            case "add":
            return new H.CmdAdd(this.username, this.args);
            case "get":
            return new H.CmdGet(this.args);
        }
        return null;
    }
    execute(cmd)
    {
        if(cmd)
        {
            let data = {data:this.data,ch:'ch'};
            let isOwner = this.ch_type!='dm'?
                this.server.owner.id === this.usr.id
                : false;
            logger.info(`User is owner: ${isOwner}`);
            if(cmd.channels.includes(this.ch_type))
            {
                if(this.ch_type == 'dm' || isOwner
                || this.roles.some(r => cmd.roles.includes(r.name)))
                {
                    let output = cmd.execute(this.opt, isOwner);
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
