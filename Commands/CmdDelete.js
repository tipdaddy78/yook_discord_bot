const Command = require('./Commands.js');
const logger = require('../Logger.js');
var linksDB = require('../Database/Database.js');

module.exports = class Delete extends Command
{
    constructor(usr, link, tag)
    {
        super('delete');
        this.usr = usr;
        this.link = link;
        this.tag = tag?tag:null;
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
            case 'tag': case 't':
            let t_regex = new RegExp(this.tag, 'i');
            let tag = entry.tags.find(t => t.match(t_regex));
            return  (this.link && this.tag)?
                    key?
                    entry.op==this.usr?
                    tag?
                    this.deleteTag(key,entry,tag)
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
    deleteTag(link,entry,tag)
    {
        entry.tags.splice(entry.tags.indexOf(tag),1);
        linksDB.add(link,entry);
        return this.exit('deleted');
    }
}
