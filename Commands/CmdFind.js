const logger = require('../Logger.js');
var linksDB = require('../Database/Database.js');

module.exports = class Find
{
    static links(keywds)
    {
        let out = [];
        let tmp_db = {};
        linksDB.forall(k =>
        {
            linksDB.getEntry(k).tags.forEach(t =>
            {
                keywds.forEach(w =>
                {
                    if(t.includes(w) || k.includes(w))
                    {
                        tmp_db[k] = linksDB.getEntry(k);
                    }
                });
            });
        });
        for(let k in tmp_db)
        {
            out.push(`[${k}](<${tmp_db[k].data}>)`
                + `\nPosted by ${tmp_db[k].op}`
                + `\ntags: ${tmp_db[k].tags}`);
        }
        out.sort();
        return out;
    }
    static tags(keywds)
    {
        let out = [];
        linksDB.foreach(link =>
        {
            link.tags.forEach(t =>
            {
                if(keywds.length == 0 && !out.includes(t))
                {
                    out.push(t);
                }
                else
                {
                    keywds.forEach(w =>
                    {
                        if(t.includes(w) && !out.includes(t))
                        {
                            out.push(t);
                        }
                    });
                }
            });
        });
        out.sort();
        return out.join(', ');
    }
}
