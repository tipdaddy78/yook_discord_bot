const logger = require('../Logger.js');
const Command = require('./Commands.js');
var linksDB = require('../Database/Database.js');

module.exports = class CmdAdd extends Command
{
    constructor(args, usr)
    {
        super('add');
        this.args = args;
        this.usr = usr;
        this.ch = 're';
    }
    exit(exit_msg)
    {
        return {ch:this.ch,msg:this.message(exit_msg)};
    }
    execute(opt)
    {
        if(this.args.length > 0)
        {
            switch(opt)
            {
                case 'tags': case 'tag': case 't':
                return this.addTags(this.args[0],this.args.slice(1),this.usr);

                case 'link': case 'l': default:
                return this.addLink(this.args[0],this.args[1],this.args.slice(2),this.usr);
            }
        }
        return this.exit('missingarg');
    }
    toJSO(link,tags,op)
    {
        return {data:link,tags:tags,op:op};
    }
    addTags(link, tags, usr)
    {
        if(linksDB.exists(link))
        {
            let entry = linksDB.getEntry(link);
            if(entry.op==usr)
            {
                let new_tags = entry.tags;
                for(let t of tags)
                {
                    if(!new_tags.includes(t))
                    {
                        new_tags.push(t);
                    }
                }
                linksDB.add(link, this.toJSO(entry.data, new_tags, usr));
                return this.exit('overwrite');
            }
            return this.exit('noedit');
        }
        return this.exit('notfound');
    }
    addLink(link, name, tags, op)
    {
        if(link.startsWith('http://')
            || link.startsWith('https://'))
        {
            if(linksDB.exists(name))
            {
                if(linksDB.getEntry(name).op==op)
                {
                    linksDB.add(name, this.toJSO(link,tags,op));
                    return this.exit('added');
                }
                return this.exit('noedit');
            }
            linksDB.add(name, this.toJSO(link,tags,op));
            return this.exit('added');
        }
        return this.exit('badlink');
    }
}
