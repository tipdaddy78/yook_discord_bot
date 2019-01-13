const fs = require('fs');
const logger = require('./logger.js');

//Database class represents a JSON file which may be read from and written to
module.exports = class Database
{
    constructor(filepath, json)
    {
        this.db = json;
        this.filepath = filepath;
    }
    getEntry(key)
    {
        return this.db[key];
    }
    addEntry(key, value)
    {
        let flags = {"exists":false};
        if(this.db[key])
        {
            flags.exists = true;
        }
        else
        {
            this.db[key] = value;
            this.updateDB();
        }
        return flags;
    }
    overwriteEntry(key, value)
    {
        this.db[key] = value;
        this.updateDB();
    }
    delete(name)
    {
        for(let o in this.db)
        {
            if(name === o)
            {
                delete this.db[name];
                this.updateDB();
                return true;
            }
        }
        return false;
    }
    deleteLast()
    {
        let last = null;
        for(let o in this.db)
        {
            last = o;
        }
        delete this.db[last];
        this.updateDB();
        return last;
    }
    get(name)
    {
        let out = {};
        out[name] = this.db[name];
        return out;
    }
    getAll()
    {
        let out = {};
        for(let key in this.db)
        {
            out[key] = this.db[key];
        }
        return out;
    }
    find(tags)
    {
        let out = {};
        for(let key in this.db)
        {
            for(let i = 0; i < tags.length; i++)
            {
                if(this.db[key].tags.includes(tags[i]))
                {
                    out[key] = this.db[key];
                }
            }
        }
        return out;
    }
    filter(tags)
    {
        let out = {};
        for(let key in this.db)
        {
            let count = 0;
            for(let i = 0; i < tags.length; i++)
            {
                if(this.db[key].tags.includes(tags[i]))
                {
                    count++;
                }
            }
            if(count == tags.length)
            {
                out[key] = this.db[key];
            }
        }
        return out;
    }
    updateDB()
    {
        fs.writeFile(this.filepath, JSON.stringify(this.db, null, 4), (err) =>
            {
                if(err) throw err;
            }
        );
    }
}
