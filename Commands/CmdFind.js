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
        let out = linksDB.filter((key,entry) =>
        {
            return entry.tags.some(tag => this.keywords.some(w =>
            {
                let regex = new RegExp(w,'i');
                return tag.match(regex) || key.match(regex);
            }));
        });
        out.sort((a,b) =>
        {
            let varA = a[0].toUpperCase();
            let varB = b[0].toUpperCase();
            if(varA > varB) return -1;
            if(varA < varB) return 1;
            return 0;
        });
        out = out.map(entry =>
            (`[${entry[0]}](<${entry[1].data}>)`
            + `\nPosted by ${entry[1].op}`
            + `\ntags: ${entry[1].tags.join(', ')}\n`));
        return out.length? out : this.message('notfound');
    }
    tags()
    {
        let out = [];

        linksDB.foreach((k,link) =>
        {
            let tags = link.tags.filter(t => !this.keywords.length
            || this.keywords.some(w =>
            {
                let w_regex = new RegExp(w, 'i');
                return t.match(w_regex);
            }));
            out = out.concat(tags.filter(t => !out.includes(t)));
        });
        out.sort((a,b) =>
        {
            let varA = a.toUpperCase();
            let varB = b.toUpperCase();
            if(varA > varB) return 1;
            if(varA < varB) return -1;
            return 0;
        });
        return out.length? out.join(', ') : this.message('notfound');
    }
}
