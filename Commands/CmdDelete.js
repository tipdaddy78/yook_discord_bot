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
        logger.info(`User: ${usr} Link: ${link} Tag: ${tag}`);
    }
    execute(opt)
    {
        switch(opt)
        {
            case 'tag': case 't':
            return  (this.link && this.tag)?
                    linksDB.exists(this.link)?
                    linksDB.getEntry(this.link).op==this.usr?
                    linksDB.getEntry(this.link).tags.includes(this.tag)?
                    this.deleteTag(this.link,linksDB.getEntry(this.link))
                    : this.exit('notfound')
                    : this.exit('wrongop')
                    : this.exit('notfound')
                    : this.exit('noinput');
            case 'link': case 'l': default:
            return  this.link?
                    linksDB.exists(this.link)?
                    linksDB.getEntry(this.link).op==this.usr?
                    this.deleteLink(this.link)
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
    deleteTag(link,entry)
    {
        entry.tags.splice(entry.tags.indexOf(this.tag),1);
        linksDB.add(link,entry);
        return this.exit('deleted');
    }
}
