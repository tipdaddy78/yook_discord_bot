const Command = require('./Commands.js');
const logger = require('../Logger.js');
var linksDB = require('../Database/Database.js');
const msg = ['deleted','wrongop','notfound','noinput'];

module.exports = class Delete extends Command
{
    static link(usr, link)
    {
        if(link)
        {
            if(linksDB.exists(link))
            {
                if(linksDB.getEntry(link).op==usr)
                {
                    linksDB.delete(link)
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
    static tag(usr, link, tag)
    {
        if(link && tag)
        {
            if(linksDB.exists(link))
            {
                let tmp_entry = linksDB.getEntry(link);
                if(tmp_entry.op==usr)
                {
                    if(tmp_entry.tags.includes(tag))
                    {
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
