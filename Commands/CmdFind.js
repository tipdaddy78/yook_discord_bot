const logger = require('../Logger.js');

module.exports = class Find
{
    static links(db, keywds)
    {
        let out = [];
        let tmp_db = {};
        for(let k in db)
        {
            for(let t of db[k].tags)
            {
                for(let w of keywds)
                {
                    if(t.includes(w) || k.includes(w))
                    {
                        tmp_db[k] = db[k];
                    }
                }
            }
        }
        for(let k in tmp_db)
        {
            out.push('[' + k + '](<' + tmp_db[k].data
                + '>) Posted by ' + tmp_db[k].op
                + '\ntags: ' + tmp_db[k].tags);
        }
        out.sort();
        return out;
    }
    static tags(db, keywds)
    {
        let out = [];
        for(let k in db)
        {
            for(let t of db[k].tags)
            {
                for(let w of keywds)
                {
                    if((t.includes(w))
                        && !out.includes(t))
                    {
                        out.push(t);
                    }
                }
                if(keywds.length == 0)
                {
                    out.push(t);
                }
            }
        }
        out.sort();
        return out.join(', ');
    }
}
