const Parse = require('./parsehelper.js');
const Find = require('./find.js');
const cmdList = require('./commands.json');
const logger = require('./logger.js');

module.exports = class Fetch
{
    static exists(cmd)
    {
        return cmdList.hasOwnProperty(cmd);
    }
    static get(cmd)
    {
        return cmdList[cmd];
    }
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
        //checks if user inserted '!' before the command they're looking for help
        let cmd = (a)?
            ((a[0]=='!')?
                a.substring(1) : a)
            :'help';
        let out = ['Usage:'];
        let i = 0;
        if(this.exists(cmd) && a)
        {
            for(let h of this.get(cmd).help)
            {
                out.push(h);
                i = ++h;
            }
            if(this.get(cmd).roles.length > 0)
            {
                out.push('You must have one of these roles: ');
                out.push('`' + this.get(cmd).roles + '`');
            }
            out.push('This commands works in: ');
            out.push(this.get(cmd).channels + ' channels');
            out.push('List of commands:');
            let c_list = [];
            for(let c in cmdList)
            {
                if(c != 'invalid')
                {
                    c_list.push('!' + c);
                }
            }
            out.push(c_list);
            e.emit(
                'cmd',
                {
                    'data':e.data,
                    'ch':'dm',
                    'out':out,
                    'cmd':'help'
                }
            );
        }
        else
        {
            Fetch.help(e, 'help');
        }
    }
    //Addlink command will add a new link to a list of links associated
    //with a name in an xml doc
    //Example:  !addlink meme https://dank.meme
    //          Your link has been added!
    static addLink(e, a)
    {
        let cmd = 'addlink';
        let msg = '';
        if(e.checkChannel(this.get(cmd)) && e.hasPermission(this.get(cmd)))
        {
            if(a.length >= 3)
            {
                let link = a[0];
                let name = a[1];
                let tags = [];
                let op = e.username;
                for(let i = 2; i < a.length; i++)
                {
                    tags.push(a[i].toLowerCase());
                }
                if(link.substring(0,4) == "http")
                {
                    let flags = e.db.addEntry(name,
                        {
                            "data":link,
                            "tags":tags,
                            "op":op
                        }
                    );
                    if(!flags.exists)
                    {
                        msg = cmdList.addlink.confirm.added;
                        e.emit(
                            'cmd',
                            {
                                'data':e.data,
                                'ch':'re',
                                'out':msg,
                                'cmd':cmd
                            }
                        );
                    }
                    else
                    {
                        if(e.db.getEntry(name).op == op)
                        {
                            e.db.overwriteEntry(name,
                                {
                                    "data":link,
                                    "tags":tags,
                                    "op":op
                                }
                            );
                            msg = cmdList.addlink.confirm.overwrite;
                            e.emit(
                                'cmd',
                                {
                                    'data':e.data,
                                    'ch':'re',
                                    'out':msg,
                                    'cmd':cmd
                                }
                            );
                        }
                        else
                        {
                            msg = cmdList.addlink.errors.noedit;
                            e.emit(
                                'err',
                                {
                                    'data':e.data,
                                    'ch':'re',
                                    'out':msg,
                                    'cmd':cmd,
                                    'err':'Insufficient Permissions'
                                }
                            );
                        }
                    }
                }
                else
                {
                    msg = cmdList.addlink.errors.badlink;
                    e.emit(
                        'err',
                        {
                            'data':e.data,
                            'ch':'re',
                            'out':msg,
                            'cmd':cmd,
                            'err':'Incorrect Input'
                        }
                    );
                }
            }
            else
            {
                msg = cmdList.addlink.errors.missingarg;
                e.emit(
                    'err',
                    {
                        'data':e.data,
                        'ch':'re',
                        'out':msg,
                        'cmd':cmd,
                        'err':'No Input'
                    }
                );
            }
        }
    }
    //Getlink command will reply to user the exact link with the specified
    //key/name provided in argument list
    //Example:  !getlink meme
    //          @user, https://dank.meme
    static getLink(e, n)
    {
        let cmd = 'getlink';
        let out = [];
        if(n)
        {
            let out = Parse.links(e.db.get(n));
            if(out.length > 0)
            {
                e.emit(
                    'cmd',
                    {
                        'data':e.data,
                        'ch':'re',
                        'out':out,
                        'cmd':cmd,
                    }
                );
            }
            else
            {
                out = cmdList.getlink.errors.notfound;
                e.emit(
                    'err',
                    {
                        'data':e.data,
                        'ch':'re',
                        'out':out,
                        'cmd':cmd,
                        'err':'Not Found'
                    }
                );
            }
        }
        else
        {
            out = cmdList.getlink.errors.noinput;
            e.emit(
                'err',
                {
                    'data':e.data,
                    'ch':'re',
                    'out':out,
                    'cmd':cmd,
                    'err':'Not Found'
                }
            );
        }
    }
    //Deletelink command deletes the link with specified name in the
    //links.json file
    //Example:  !deletelink meme
    //          @user, Successfully deleted link.
    static deleteLink(e, n)
    {
        let cmd = 'deletelink';
        if(e.checkChannel(this.get(cmd)) && e.hasPermission(this.get(cmd)))
        {
            if(n)
            {
                let d = e.db.delete(n);
                if(d)
                {
                    e.emit(
                        'cmd',
                        {
                            'data':e.data,
                            'ch':'re',
                            'out':cmdList.deletelink.confirm,
                            'cmd':cmd
                        }
                    );
                }
                else
                {
                    e.emit(
                        'err',
                        {
                            'data':e.data,
                            'ch':'re',
                            'out':cmdList.deletelink.errors.notfound,
                            'cmd':cmd,
                            'err':'Not Found'
                        }
                    );
                }
            }
            else
            {
                e.emit(
                    'err',
                    {
                        'data':e.data,
                        'ch':'re',
                        'out':cmdList.deletelink.errors.noinput,
                        'cmd':cmd,
                        'err':'No Input'
                    }
                );
            }
        }
    }
    //Deletelast command deletes last link in the links.json file
    //Example:  !deletelast
    //          @user, Successfully deleted last link.
    static deleteLast(e)
    {
        let cmd = 'deletelast'
        if(e.checkChannel(this.get(cmd)) && e.hasPermission(this.get(cmd)))
        {
            let d = e.db.deleteLast();
            if(d)
            {
                e.emit(
                    'cmd',
                    {
                        'data':e.data,
                        'ch':'re',
                        'out':cmdList.deletelast.confirm,
                        'cmd':cmd
                    }
                );
            }
            else
            {
                e.emit(
                    'err',
                    {
                        'data':e.data,
                        'ch':'re',
                        'out':cmdList.deletelast.errors.nolinks,
                        'cmd':cmd,
                        'err':'No Input'
                    }
                );
            }
        }
    }
    //Searches database for links containing ANY of the specified tags. This function
    //will only return links that contain all specified tags
    //Example:  !findlinks tag1, tag2, tag3
    //          link 1: https://a-link
    //          link 2: https://b-link
    static findLinks(e, t)
    {
        let cmd = 'findlinks';
        let out = '';
        if(t)
        {
            let links = e.db.find(t);
            out = Parse.links(links);
            if(out.length > 0)
            {
                out.sort();
                e.emit(
                    'cmd',
                    {
                        'data':e.data,
                        'ch':'dm',
                        'out':out,
                        'cmd':cmd
                    }
                );
            }
            else
            {
                out = cmdList.findlinks.errors.nolinks;
                e.emit(
                    'err',
                    {
                        'data':e.data,
                        'ch':'dm',
                        'out':out,
                        'cmd':cmd,
                        'err':'Not Found'
                    }
                )
            }
        }
        else
        {
            out = cmdList.findlinks.errors.notags;
            e.emit(
                'err',
                {
                    'data':e.data,
                    'ch':'dm',
                    'out':out,
                    'cmd':cmd,
                    'err':'No Input'
                }
            )
        }
    }
    //Searches database for links containing ALL of the specified tags. This function
    //will only return links that contain all specified tags
    //Example:  !findlinks tag1, tag2, tag3
    //          link 1: https://a-link
    //          link 2: https://b-link
    static filterLinks(e, t)
    {
        let cmd = 'filterlinks';
        let out = '';
        if(t)
        {
            let links = e.db.filter(t);
            out = Parse.links(links);
            if(out.length > 0)
            {
                out.sort();
                e.emit(
                    'cmd',
                    {
                        'data':e.data,
                        'ch':'dm',
                        'out':out,
                        'cmd':cmd
                    }
                );
            }
            else
            {
                out = cmdList.filterlinks.errors.nolinks;
                e.emit(
                    'err',
                    {
                        'data':e.data,
                        'ch':'dm',
                        'out':out,
                        'cmd':cmd,
                        'err':'Not Found'
                    }
                )
            }
        }
        else
        {
            out = cmdList.filterlinks.errors.notags;
            e.emit(
                'err',
                {
                    'data':e.data,
                    'ch':'dm',
                    'out':out,
                    'cmd':cmd,
                    'err':'No Input'
                }
            )
        }
    }
    //Returns all values of specified key, links or tags, from all items in the
    //database. Links will return everything from teh database.
    //Example:  !showall links
    //          [link 1](https://link)
    //          tags: tag 1, tag 2
    //          Posted by usr
    //          ...
    static showAll(e, a)
    {
        let cmd = 'showall';
        let data = e.db.all;
        let out = [];
        if(a == 'links')
        {
            out = Parse.links(data);
            e.emit(
                'cmd',
                {
                    'data':e.data,
                    'ch':'dm',
                    'out':out,
                    'cmd':cmd
                }
            );
        }
        else if (a == 'tags')
        {
            out = Parse.tags(data);
            if(out.length > 0)
            {
                e.emit(
                    'cmd',
                    {
                        'data':e.data,
                        'ch':'dm',
                        'out':out,
                        'cmd':cmd
                    }
                );
            }
            else
            {
                out = cmdList.showall.errors.nodata;
                e.emit(
                    'err',
                    {
                        'data':e.data,
                        'ch':'dm',
                        'out':out,
                        'cmd':cmd,
                        'err':'Not Found'
                    }
                )
            }
        }
        else
        {
            Fetch.help(e, cmd);
        }
    }
    static find(e, opt, args)
    {
        let command = 'find';
        let output = [];
        logger.info('Searching for ' + opt);
        switch(opt)
        {
            case 'links':
            output = Parse.links(Find.links(e.db.all, args));
            break;
            case 'tags':
            output = Find.tags(e.db.all, args);
            break;
        }
        if(output.length > 0)
        {
            e.emit(
                'cmd',
                {
                    data:e.data,
                    ch:'dm',
                    out:output,
                    cmd:command
                }
            );
        }
        else
        {
            output = cmdList.find.errors.notfound;
            e.emit(
                'err',
                {
                    data:e.data,
                    ch:'dm',
                    out:output,
                    cmd:command,
                    err:'No results'
                }
            );
        }
    }
}
