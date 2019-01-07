const fs = require('fs');

module.exports = class Database {
    constructor(filepath, json) {
        this.db = json;
        this.filepath = filepath;
    }
    add(name, data) {
        this.db[name] = data;
        fs.writeFile(this.filepath, JSON.stringify(this.db), (err) => {
            if(err) throw err;
        });
        return true;
    }
    delete(name) {
        for(let o in this.db) {
            if(name === o) {
                delete this.db[name];
                return true;
            }
        }
        return false;
    }
    deleteLast() {
        let last = null;
        for(let o in this.db) {
            last = o;
        }
        delete this.db[last];
        return last;
    }
    get(name) {
        let out = null;
        for(let key in this.db) {
            if(name === key) {
                out = this.db[name];
            }
        }
        return out;
    }
}
