const fs = require('fs');
const logger = require('../Logs/Logger.js');


//Database class represents a JSON file which may be read from and written to
class Database
{
    constructor(json, filepath)
    {
        this.db = json;
        this.filepath = filepath;
    }
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
    //Returns an array of key-value pairs that satisfy the callback test
    //function. It works the same way that Array.filter() works.
    //
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
    //Writes the database to specified file passed into constructor
    //
    //The write completely replaces the file with new data as opposed to just
    //editing certain section, this is a limitation of NodeJS
    //
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

const links_db_filename = './Database/links.json';
const links_db_file = require('./links.json');
const quotes_db_filename = './Database/quotes.json';
const quotes_db_file = require('./quotes.json');
var links = new Database(links_db_file, links_db_filename);
var quotes = new Database(quotes_db_file, quotes_db_filename);
var DB = {links:links,quotes:quotes};
module.exports = DB;
