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
    get all()
    {
        return this.db;
    }
    getEntry(key)
    {
        return this.db[key];
    }
    get(name)
    {
        let out = {};
        out[name] = this.db[name];
        return out;
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
    updateDB()
    {
        fs.writeFile(this.filepath, JSON.stringify(this.db, null, 4), (err) =>
            {
                if(err) throw err;
            }
        );
    }
}
