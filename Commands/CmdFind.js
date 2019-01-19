const logger = require('../Logger.js');
const Command = require('./Commands.js');
var linksDB = require('../Database/Database.js');

module.exports = class CmdFind extends Command
{
    constructor(args)
    {
        super('find');
        this.keywords = args;
        this.ch = 'dm';
    }
    execute(opt)
    {
        switch(opt)
        {
            case 'tags': case 'tag': case 't':
            return this.exit(this.tags());
            case 'links': case 'link': case 'l': default:
            return this.exit(this.links());
        }
    }
    exit(msg)
    {
        return {ch:this.ch,msg:msg};
    }
    links()
    {
        let out = [];
        let tmp_db = {};

        linksDB.foreach((key, entry) =>
        {
            if(entry.tags.some(tag => this.keywords.some(w =>
                tag.includes(w) || key.includes(w))))
            {
                out.push(`[${key}](<${entry.data}>)`
                    + `\nPosted by ${entry.op}`
                    + `\ntags: ${entry.tags}`)
            }
        });
        out.sort();
        return out.length? out : this.message('notfound');
    }
    tags()
    {
        let out = [];

        linksDB.foreach((k, link) =>  link.tags.forEach(t =>
        {
            if(this.keywords.some(w => t.includes(w) && !out.includes(t)))
            {
                out.push(t)
            }
        }));
        out.sort();
        return out.length? out.join(', ') : this.message('notfound');
    }
}
