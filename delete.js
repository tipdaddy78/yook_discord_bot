const DB = require('./database.js');
const msg = ['deleted','wrongop','notfound','noinput'];

module.exports = class Delete
{
    static link(db, usr, link)
    {
        if(link)
        {
            if(db.get(link).op==usr)
            {
                if(db.delete(link) == DB.Flags.EXISTS)
                {
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
            return msg[3];
        }
    }
    static tags(db, usr, link, tag)
    {
        if(link && tag)
        {
            if(db.get(link).op==usr)
            {
                if(db.get(link).tags.includes(tag))
                {
                    let tmp_entry = db.get(link);
                    tmp_entry.tags.splice(tmp_entry.tags.indexOf(tag),1);
                    db.overwrite(link,tmp_entry);
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
            return msg[3];
        }
    }
}
