const H = require('./header.js');
var linksDB = H.Database.links;

module.exports = class CmdFind extends H.Command
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
            arguments[2](this.exit(this.tags()));
            break;
            case 'links': case 'link': case 'l': default:
            arguments[2](this.exit(this.links()));
            break;
        }
    }
    exit(msg)
    {
        return {ch:this.ch,msg:msg};
    }
    links()
    {
        let match = (w, key, tags) =>
        {
            let regex = new RegExp(w,'i');
            return tags.some(t => regex.test(t)) || regex.test(key);
        }

        let check = (k,e) => this.keywords.some(w => match(w,k,e.tags));

        let out = linksDB.filter((k,e) => check(k,e));

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

        let match = (t,w) => (new RegExp(w,'i')).test(t);
        let check = (k,t) => !k.length || k.some(w => match(t,w));

        linksDB.foreach((key,link) =>
        {
            let tags = link.tags.filter(t => check(this.keywords, t));
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
