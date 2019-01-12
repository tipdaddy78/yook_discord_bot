const Parse = require('./parsehelper.js');
const cmdList = require('./commands.json');

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
        let cmd = (a)? ((a[0]=='!')?a.substring(1):a):'help';
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
            e.emit('cmd', e.data, 'help', out, 'dm');
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
                        e.emit('cmd', e.data, cmd, msg, 're');
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
                            e.emit('cmd', e.data, cmd, msg, 're');
                        }
                        else
                        {
                            msg = cmdList.addlink.errors.noedit;
                            e.emit('err', e.data, cmd, msg, 're');
                        }
                    }
                }
                else
                {
                    msg = cmdList.addlink.errors.badlink;
                    e.emit('err', e.data, cmd, msg, 're');
                }
            }
            else
            {
                msg = cmdList.addlink.errors.missingarg;
                e.emit('err', e.data, cmd, msg, 're');
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
        let out = '';
        if(n)
        {
            let out = Parse.links(e.db.get(n));
            if(out)
            {
                e.emit('cmd', e.data, cmd, out, 're');
            }
            else
            {
                out = cmdList.getlink.errors.notfound;
                e.emit('cmd', e.data, cmd, out, 're');
            }
        }
        else
        {
            out = cmdList.getlink.errors.noinput;
            e.emit('cmd', e.data, cmd, out, 're');
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
                    e.emit('cmd', e.data, cmd, cmdList.deletelink.confirm, 're');
                }
                else
                {
                    e.emit('err', e.data, cmd, cmdList.deletelink.errors.notfound, 're');
                }
            }
            else
            {
                e.emit('err', e.data, cmd, cmdList.deletelink.errors.noinput, 're');
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
                e.emit('cmd', e.data, cmd, cmdList.deletelast.confirm, 're');
            }
            else
            {
                e.emit('err', e.data, cmd, cmdList.deletelast.errors.nolinks, 're');
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
                e.emit('cmd', e.data, cmd, out, 'dm');
            }
            else
            {
                out = cmdList.findlinks.errors.nolinks;
                e.emit('err', e.data, cmd, out, 'dm');
            }
        }
        else
        {
            out = cmdList.findlinks.errors.notags;
            e.emit('err', e.data, cmd, out, 'dm');
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
                e.emit('cmd', e.data, cmd, out, 'dm');
            }
            else
            {
                out = cmdList.filterlinks.errors.nolinks;
                e.emit('err', e.data, cmd, out, 'dm');
            }
        }
        else
        {
            out = cmdList.filterlinks.errors.notags;
            e.emit('err', e.data, cmd, out, 'dm');
        }
    }
    //Returns all values of specified key, links or tags, from all items in the
    //database. Links will return everything from teh database.
    //Example:  !showall links
    //          [link 1](https://link)
    //          tags: tag 1, tag 2
    //          Posted by usr
    //          ...
    static showAll(e, a) {
        let cmd = 'showall';
        let data = e.db.getAll();
        let out = [];
        if(a == 'links')
        {
            out = Parse.links(data);
            out.sort();
        }
        else if (a == 'tags')
        {
            for(let d of data)
            {
                for(let t of d.tags)
                {
                    if(!out.includes(t))
                    {
                        out.push(t);
                    }
                }
            }
            out.sort();
            if(out.length > 0)
            {
                e.emit('cmd', e.data, cmd, out, 'dm');
            }
            else
            {
                let msg = cmdList.showall.errors.nodata;
                e.emit('err', e.data, cmd, msg, 'dm');
            }
        }
        else
        {
            Fetch.help(e, cmd);
        }
    }
}
