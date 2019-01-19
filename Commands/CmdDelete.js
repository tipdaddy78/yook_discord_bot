const Command = require('./Commands.js');
const logger = require('../Logger.js');
var linksDB = require('../Database/Database.js');

module.exports = class Delete extends Command
{
    constructor(usr, args)
    {
        super('delete');
        this.usr = usr;
        this.link = args[0];
        this.tags = args.length>1?args.slice(1):[];
        this.ch = 'ch';
    }
    execute(opt)
    {
        let l_regex = new RegExp(this.link, 'i');
        let entry = linksDB.find(k => k.match(l_regex));
        let key = entry[0];
        entry = entry[1];
        switch(opt)
        {
            case 'tags': case 'tag': case 't':
            let t_regex = this.tags.map(t => new RegExp(t,'i'));
            let tags = entry.tags.filter(t => t_regex.some(r => t.match(r)));
            return  (this.link && this.tags.length)?
                    key?
                    entry.op==this.usr?
                    tags.length?
                    this.deleteTags(key,entry,tags)
                    : this.exit('notfound')
                    : this.exit('wrongop')
                    : this.exit('notfound')
                    : this.exit('noinput');
            case 'link': case 'l': default:
            return  this.link?
                    key?
                    entry.op==this.usr?
                    this.deleteLink(key)
                    : this.exit('wrongop')
                    : this.exit('notfound')
                    : this.exit('noinput');
        }
    }
    exit(msg)
    {
        return {ch:this.ch,msg:this.message(msg)}
    }
    deleteLink(link)
    {
        linksDB.delete(link);
        return this.exit('deleted');
    }
    deleteTags(link,entry,tags)
    {
        entry.tags = entry.tags.filter(t => !tags.includes(t));
        linksDB.add(link,entry);
        return this.exit('deleted');
    }
}
