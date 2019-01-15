const logger = require('../Logger.js');
const Command = require('./Commands.js');
const msg = ['added','overwrite','badlink','noedit','notfound','missingarg']

module.exports = class CmdAdd extends Command
{
    constructor(opt, db, usr, args)
    {
        super('add');
        this.opt = opt;
        this.db = db;
        this.usr = usr;
        this.args = args;
    }
    set args(args)
    {
        if(args.length > 0)
        {
            switch(this.opt)
            {
                case 'tags': case 'tag': case 't':
                this.name = args[0];
                this.tags = args.slice(1);
                this.entry = this.db.getEntry(this.name);
                break;
                case 'link': case 'l': default:
                this.name = args[1];
                this.entry = this.createObj(args[0], args.slice(2), this.usr);
                break;
            }
        }
        else
        {
            this.msg = 'missingarg';
        }
    }
    createObj(link, tags, op)
    {
        return {data:link,tags:tags,op:op};
    }
    tags()
    {

    }
    static tag(db, usr, args)
    {
        if(args.length > 0)
        {
            let link = args[0];
            let tags = args.slice(1);
            if(db.exists(link))
            {
                let entry = db.getEntry(link);
                if(entry.op==usr)
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
                    return msg[3];
                }
            }
            else
            {
                return msg[4];
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
