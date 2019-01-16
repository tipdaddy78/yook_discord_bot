const Command = require('./Commands.js');
const Find = require('./CmdFind.js');
const Del = require('./CmdDelete.js');
const Add = require('./CmdAdd.js');
const logger = require('../Logger.js');
var linksDB = require('../Database/Database.js');

module.exports = class CommandFetcher
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
        if(Command.exists(cmd.str))
        {
            let roles = [];
            let ch = [];
            let clist = [];
            if(cmd.roles.length > 0)
            {
                cmd.roles.forEach(r => roles.push(`\`${r}\``));
                out.push('You must have one of these roles: ');
                out.push(roles.join(', '));
            }
            cmd.channels.forEach(c => ch.push(`\`${c}\``));
            Command.list().forEach(c => clist.push(`\`${c}\``));

            cmd.help.forEach(h => out.push(h));
            out.push('This command works in: ');
            out.push(`${ch.join(', ')} channels`);
            out.push('List of commands:');
            out.push(clist.join(', '));
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
            CommandFetcher.help(e, 'help');
        }
    }
    static get(e, opt, name)
    {
        let output = [];
        let cmd = new Command('get');
        switch(opt)
        {
            case 'link': case 'l': default:
            if(linksDB.exists(name))
            {
                let link = linksDB.getEntry(name);
                output.push('['+name+']'+'(<'+link.data+'>)');
                output.push('tags: '+link.tags.join(', '));
                output.push('Posted by ' + link.op);
            }
            else
            {
                output = cmd.message('notfound');
            }
            return e.emit('cmd',
                {
                    data:e.data,
                    ch:'ch',
                    out:output
                }
            );
        }
    }
    static find(e, opt, args)
    {
        let output = [];
        let cmd = new Command('find');
        switch(opt)
        {
            case 'tags': case 'tag': case 't':
            output = Find.tags( args);
            break;
            case 'links': case 'link': case 'l': default:
            output = Find.links(args);
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
        let cmd = new Command('delete');
        let output = '';
        if(e.checkChannel(cmd.get())
            && e.hasPermission(cmd.get()))
        {
            switch(opt)
            {
                case 'tag': case 't':
                output = Del.tag(e.data.username, args[0], args[1]);
                break;
                case 'link': case 'l': default:
                output = Del.link(e.data.username, args[0]);
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
