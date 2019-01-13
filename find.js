const logger = require('./logger.js');

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
        if(keywds.length == 0)
        {
            logger.log('Searching for all tags');
        }
        else
        {
            logger.log('Searching for tags: ' + keywds.toString());
        }
        for(let k in db)
        {
            for(let t of db[k].tags)
            {
                for(let w of keywds)
                {
                    if((keywds.length==0 || t.includes(w))
                        && !out.includes(t))
                    {
                        out.push(t);
                    }
                }
            }
        }
        out.sort();
        return out.toString();
    }
}
