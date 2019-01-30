const H = require('./header.js');
var linksDB = H.Database.links;

module.exports = class CmdAdd extends H.Command
{
    constructor(usr, args)
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
    execute(opt, isOwner)
    {
        let link, name, tags;
        switch(opt)
        {
            case 'tags': case 'tag': case 't':
            link = this.args[0];
            tags = this.args.slice(1);
            return  link && tags.length?
                    this.addTags(link, tags, this.usr, isOwner)
                    : this.exit('missingarg');

            case 'link': case 'l': default:
            link = this.args[0];
            name = this.args[1];
            tags = this.args.slice(2);
            return  link && name && tags.length?
                    this.addLink(link, name, tags, this.usr, isOwner)
                    : this.exit('missingarg');
        }
    }
    addTags(link, tags, usr, isOwner)
    {
        let l_regex = new RegExp('^' + link + '\\b','i');
        let entry = linksDB.find(k => k.match(l_regex));
        let key = entry[0];
        entry = entry[1];

        let check = (t) =>
        {
            let regex = new RegExp(t,'i');
            return !entry.tags.some(e_t => e_t.match(regex));
        }

        let new_tags = () => tags.filter(t => check(t));

        let new_entry = () =>
        {
            entry.tags = entry.tags.concat(new_tags());
            return entry;
        }

        return  key?
                entry.op==usr || isOwner?
                this.add(key,new_entry(),'overwrite')
                : this.exit('noedit')
                : this.exit('notfound');
    }
    addLink(link, name, tags, usr, isOwner)
    {
        let regex = new RegExp('^' + name + '\\b','i');
        let entry = linksDB.find(k => k.match(regex));
        let key = entry[0];
        entry = entry[1];

        return  link.search(/\bhttps?:\/\//) != -1?
                key?
                entry.op==usr || isOwner?
                this.add(key, {data:link,tags:tags,op:usr},'overwrite')
                : this.exit('noedit')
                : this.add(name, {data:link,tags:tags,op:usr},'added')
                : this.exit('badlink');
    }
    add(key, value, msg)
    {
        linksDB.add(key, value);
        return  this.exit(msg);
    }
}
