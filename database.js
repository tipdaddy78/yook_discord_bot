const fs = require('fs');

module.exports = class Database {
    constructor(filepath, json) {
        this.db = json;
        this.filepath = filepath;
    }
    add(name, data, tags) {
        this.db[name] = {
            "data":data,
            "tags":tags
        };
        this.updateDB();
        return true;
    }
    delete(name) {
        for(let o in this.db) {
            if(name === o) {
                delete this.db[name];
                return true;
            }
        }
        this.updateDB();
        return false;
    }
    deleteLast() {
        let last = null;
        for(let o in this.db) {
            last = o;
        }
        delete this.db[last];
        this.updateDB();
        return last;
    }
    get(name) {
        let out = null;
        for(let key in this.db) {
            if(name === key) {
                out = this.db[name].data;
                out += '\nTags: '
                out += this.db[name].tags;
            }
        }
        return out;
    }
    find(tags) {
        let out = {};
        for(let key in this.db) {
            let count = 0;
            for(let i = 0; i < tags.length; i++) {
                if(this.db[key].tags.includes(tags[i])) {
                    count++;
                }
            }
            if(count == tags.length) {
                out[key] = {
                    "data":this.db[key].data,
                    "tags":this.db[key].tags
                };
            }
        }
        return out;
    }
    updateDB() {
        fs.writeFile(this.filepath, JSON.stringify(this.db, null, 2), (err) => {
            if(err) throw err;
        });
    }
}
