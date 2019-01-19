const fs = require('fs');
const logger = require('../Logger.js');


//Database class represents a JSON file which may be read from and written to
class Database
{
    constructor(json, filepath)
    {
        this.db = json;
        this.filepath = filepath;
        this.array = json;
    }
    // //Checks existence of key by exact string match
    // //
    // exists(key)
    // {
    //     return this.db.hasOwnProperty(key);
    // }
    // //Returns the value held at the specified location in the JSON object
    // //
    // getEntry(key)
    // {
    //     return this.db[key];
    // }
    // //Returns the key that returns a match from the regex defined by the
    // //specified string. Unfortunately, there isn't a simpler way to compare
    // //strings with no case sensitivity in javascript.
    // //
    // getKey(key)
    // {
    //     let regex = new RegExp(key, 'i');
    //     for(let k in this.db)
    //     {
    //         if(k.match(regex)) return k;
    //     }
    //     return null;
    // }
    //This edits the JSON by adding a new key-value pair by appending, or
    //overwriting it in the file.
    //
    add(key, value)
    {
        this.db[key] = value;
        this.updateDB();
    }
    //This edits the JSON by deleting the key-value pair from the file
    //
    delete(name)
    {
        delete this.db[name];
        this.updateDB();
    }
    //Executes callback function for every key-value pair in the DB, and
    //passes both the key and value as a parameter to the callback
    //
    foreach(callback)
    {
        for(let key in this.db)
        {
            callback(key, this.db[key]);
        }
    }
    //Returns the key-value pair in an array for the first key that satisfies
    //callback test which may return any value that can be interpretted
    //as true or false(i.e. empty string, 0, and their complements)
    //
    //If the callback test is never satisfied, returns empty array
    //
    find(callback)
    {
        for(let k in this.db)
        {
            if(callback(k,this.db[k]))
            {
                return [k,this.db[k]];
            }
        }
        return [];
    }
    filter(callback)
    {
        let out = [];
        for(let k in this.db)
        {
            if(callback(k,this.db[k]))
            {
                out.push([k,this.db[k]]);
            }
        }
        return out;
    }

    updateDB()
    {
        fs.writeFile(this.filepath, JSON.stringify(this.db, null, 4), (err) =>
            {
                logger.info(`Updating DB`);
                if(err) throw err;
            }
        );
    }
}

const file = './Database/links.json';
const db = require('./links.json');
var linksDB = new Database(db, file);
module.exports = linksDB;
