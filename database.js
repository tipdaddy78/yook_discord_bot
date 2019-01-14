const fs = require('fs');
const logger = require('./logger.js');

const Flags = {DNE:0,EXISTS:1,OVERWRITE:2};

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
    exists(key)
    {
        return this.db.hasOwnProperty(key);
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
    add(key, value)
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
                return Flags.EXISTS;
            }
        }
        return Flags.DNE;
    }
    deleteLast()
    {
        let last = null;
        for(let o in this.db)
        {
            last = o;
        }
        if(last)
        {
            delete this.db[last];
            this.updateDB();
            return Flags.EXISTS;
        }
        else
        {
            return Flags.DNE;
        }
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
