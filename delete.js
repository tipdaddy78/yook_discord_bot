const DB = require('./database.js');
const msg = ['deleted','wrongop','notfound','noinput'];

module.exports = class Delete
{
    static link(db, usr, link)
    {
        if(link)
        {
            if(db.exists(link))
            {
                if(db.getEntry(link).op==usr)
                {
                    db.delete(link)
                    return msg[0];
                }
                else
                {
                    return msg[1];
                }
            }
            else
            {
                return msg[2];
            }
        }
        else
        {
            return msg[3];
        }
    }
    static tag(db, usr, link, tag)
    {
        if(link && tag)
        {
            if(db.exists(link))
            {
                if(db.getEntry(link).op==usr)
                {
                    if(db.getEntry(link).tags.includes(tag))
                    {
                        let tmp_entry = db.getEntry(link);
                        tmp_entry.tags.splice(tmp_entry.tags.indexOf(tag),1);
                        db.add(link,tmp_entry);
                        return msg[0];
                    }
                    else
                    {
                        return msg[2];
                    }
                }
                else
                {
                    return msg[1];
                }
            }
            else
            {
                return msg[2]
            }
        }
        else
        {
            return msg[3];
        }
    }
}
