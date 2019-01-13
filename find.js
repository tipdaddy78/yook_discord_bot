
module.exports = class Find
{
    static links(db, keywds)
    {
        let out = {};
        for(let k in db)
        {
            for(let t of keywds)
            {
                if(db[k].tags.includes(t)
                    || k.includes(t))
                {
                    out[k] = db[k];
                }
            }
        }
        return out;
    }
    static tags(db, keywds)
    {
        let out = [];
        for(let k in db)
        {
            for(let t of db[k].tags)
            {
                if(!keywds
                    || (keywds.includes(t)
                    && !out.includes(t)))
                {
                    out.push(t);
                }
            }
        }
        out.sort();
        return out.toString();
    }
}
