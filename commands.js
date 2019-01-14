const DB = require('./database.js');
const Parse = require('./parsehelper.js');
const Find = require('./find.js');
const Del = require('./delete.js');
const Add = require('./add.js');
const cmdList = require('./commands.json');
const logger = require('./logger.js');

module.exports = Commands;

class Command
{
    constructor(cmd_str)
    {
        this.cmd_str = cmd_str;
    }
    exists()
    {
        return cmdList.hasOwnProperty(this.cmd_str);
    }
    get()
    {
        return cmdList[cmd_str];
    }
    static list()
    {
        let out = [];
        for(let c in cmdList)
        {
            if(cmdList[c]!='invalid')
            {
                out.push('!' + cmdList[c]);
            }
        }
        return out;
    }
    get str()
    {
        return this.cmd_str;
    }
    get help()
    {
        return cmdList[cmd_str].help;
    }
    get channels()
    {
        return cmdList[cmd_str].channels;
    }
    get roles()
    {
        return cmdList[cmd_str].roles;
    }
    get servers()
    {
        return cmdList[cmd_str].servers;
    }
    get message(msg)
    {
        return cmdList[cmd_str].output[msg];
    }
}

class Fetch
{
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
    static help(e, a)
    {
        let cmd = new Command(a?(a[0]=='!'?a.substring(1):a):'help');
        let out = ['Usage:'];
        let i = 0;
        if(cmd.exists())
        {
            for(let h of cmd.help)
            {
                out.push(h);
                i = ++h;
            }
            if(cmd.roles.length > 0)
            {
                out.push('You must have one of these roles: ');
                out.push('`' + cmd.roles + '`');
            }
            out.push('This commands works in: ');
            out.push(cmd.channels + ' channels');
            out.push('List of commands:');
            out.push(Command.list());
            e.emit(
                'cmd',
                {
                    'data':e.data,
                    'ch':'dm',
                    'out':out
                }
            );
        }
        else
        {
            Fetch.help(e, 'help');
        }
    }
    static find(e, opt, args)
    {
        let output = [];
        let cmd = new Command(e.data.cmd);
        switch(opt)
        {
            case 'help': case 'h':
            return this.help(e, cmd.str);
            case 'tags': case 'tag': case 't':
            output = Find.tags(e.db.all, args);
            break;
            case 'links': case 'link': case 'l': default:
            output = Find.links(e.db.all, args);
            break;
        }
        if(output.length == 0)
        {
            output = cmd.message('notfound');
        }
        e.emit('cmd',
            {
                data:e.data,
                ch:'dm',
                out:output
            }
        );
    }
    static delete(e, opt, args)
    {
        let cmd = new Command(e.data.cmd);
        let output = '';
        if(e.checkChannel(cmd.get())
            && e.hasPermission(cmd.get()))
        {
            switch(opt)
            {
                case 'help': case 'h':
                return this.help(e, cmd.str);
                case 'tag': case 't':
                output = Del.tag(e.db, e.data.username, args[0], args[1]);
                break;
                case 'link': case 'l': default:
                output = Del.link(e.db, e.data.username, args[0]);
                break;
            }
        }
        else
        {
            output = 'nopermit';
        }
        return e.emit('cmd',
            {
                data:e.data,
                ch:'re',
                out:cmd.message(output);
            }
        );
    }
    static add(e, opt, args)
    {
        let cmd = new Command(e.data.cmd);
        let output = '';
        if(e.checkChannel(cmd.get())
            && e.hasPermission(cmd.get()))
        {
            switch(opt)
            {
                case 'help': case 'h':
                return this.help(e, cmd.str);
                case 'tags': case 'tag': case 't':
                output = Add.tag(e.db, e.data.username, args);
                break;
                case 'link': case 'l': default:
                output = Add.link(e.db, e.data.username, args);
                break;
            }
        }
        else
        {
            output = 'nopermit';
        }
        return e.emit('cmd',
            {
                data:e.data,
                ch:'re',
                out:cmd.message(output)
            }
        );
    }
}
