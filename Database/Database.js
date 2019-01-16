const fs = require('fs');
const logger = require('../Logger.js');


//Database class represents a JSON file which may be read from and written to
class Database
{
    constructor(json, filepath)
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
                return 1;
            }
        }
        return 0;
    }
    forall(callback)
    {
        for(let key in this.db)
        {
            callback(key);
        }
    }
    foreach(callback)
    {
        for(let key in this.db)
        {
            callback(this.db[key]);
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

const file = './links.json';
const db = require(file);
var linksDB = new Database(db, file);
module.exports = linksDB;
