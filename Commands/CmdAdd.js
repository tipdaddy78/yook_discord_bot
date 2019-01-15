const logger = require('../Logger.js');
const msg = ['added','overwrite','badlink','noedit','notfound','missingarg']

module.exports = class Add
{
    static tag(db, usr, args)
    {
        if(args.length > 0)
        {
            let link = args[0];
            let tags = args.slice(1);
            let entry = db.getEntry(link);
            if(entry.op==usr)
            {
                if(db.exists(link))
                {
                    let new_tags = entry.tags;
                    for(let t of tags)
                    {
                        if(!new_tags.includes(t))
                        {
                            new_tags.push(t);
                        }
                    }
                    db.add(link,
                        {
                            data:entry.data,
                            tags:new_tags,
                            op:entry.op
                        }
                    );
                    return msg[1];
                }
                else
                {
                    return msg[4];
                }
            }
            else
            {
                return msg[3];
            }
        }
        else
        {
            return msg[5];
        }
    }
    static link(db, usr, args)
    {
        if(args.length > 0)
        {
            let link = args[0];
            let name = args[1];
            let tags = args.slice(2);
            let value =
            {
                data:link,
                tags:tags,
                op:usr
            };
            if(link.startsWith('http'))
            {
                if(db.exists(name))
                {
                    if(db.getEntry(name).op==usr)
                    {
                        db.add(name, value);
                        return msg[1];
                    }
                    else
                    {
                        return msg[3];
                    }
                }
                else
                {
                    db.add(name, value);
                    return msg[0];
                }
            }
            else
            {
                return msg[2];
            }
        }
        else
        {
            return msg[5];
        }
    }
}
