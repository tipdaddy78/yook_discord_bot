const H = require('./header.js');
var linksDB = H.Database.links;

module.exports = class Delete extends H.Command
{
    constructor(usr, args)
    {
        super('delete');
        this.usr = usr;
        this.link = args[0];
        this.tags = args.slice(1);
        this.ch = 're';
    }
    execute(opt, isOwner, callback)
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
            callback((this.link && this.tags.length)?
                    key?
                    entry.op==this.usr || isOwner?
                    tags.length?
                    this.deleteTags(key,entry,tags)
                    : this.exit('notfound')
                    : this.exit('wrongop')
                    : this.exit('notfound')
                    : this.exit('noinput'));
            break;
            case 'link': case 'l': default:
            callback(this.link?
                    key?
                    entry.op==this.usr || isOwner?
                    this.deleteLink(key)
                    : this.exit('wrongop')
                    : this.exit('notfound')
                    : this.exit('noinput'));
            break;
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
        let new_tags = entry.tags.filter(t => !tags.includes(t));
        if(new_tags.length)
        {
            entry.tags = new_tags;
            linksDB.add(link,entry);
            return this.exit('deleted');
        }
        else
        {
            return this.exit('noedit');
        }
    }
}
