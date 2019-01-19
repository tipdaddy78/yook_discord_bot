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
        let addTags = (entry) =>
        {
            entry.tags = entry.tags.concat(tags.filter(t => !entry.tags.includes(t)));
            linksDB.add(link, entry);
            return this.exit('overwrite');
        }
        return  linksDB.exists(link)?
                linksDB.getEntry(link).op==usr?
                addTags(linksDB.getEntry(link))
                : this.exit('noedit')
                : this.exit('notfound');
    }
    addLink(link, name, tags, op)
    {
        let add = () => this.add(name, this.toJSO(link, tags, op));
        return  link.search(/\bhttps?:\/\//) != -1?
                linksDB.exists(name)?
                linksDB.getEntry(name).op==op?
                add()
                : this.exit('noedit')
                : add()
                : this.exit('badlink');
    }
    add(key, value)
    {
        linksDB.add(key, value);
        return this.exit('added');
    }
}
