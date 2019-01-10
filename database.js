const fs = require('fs');

module.exports = class Database {
    constructor(filepath, json) {
        this.db = json;
        this.filepath = filepath;
    }
    add(name, data, tags, op) {
        let flags = {"overwrite":false};
        if(this.db[name]) {
            flags.overwrite = true;
        }
        this.db[name] = {
            "data":data,
            "tags":tags,
            "op":op
        };
        this.updateDB();
        return flags;
    }
    delete(name) {
        for(let o in this.db) {
            if(name === o) {
                delete this.db[name];
                this.updateDB();
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
                out += '\nPosted by ';
                out += this.db[name].op;
            }
        }
        return out;
    }
    getAllTags() {
        let out = [];
        for(let key in this.db) {
            for(let t in this.db[key].tags) {
                if(!out.includes(this.db[key].tags[t])) {
                    out.push(this.db[key].tags[t]);
                }
            }
        }
        return out;
    }
    getAllLinks() {
        let out = [];
        for(let key in this.db) {
            out.push('[' + key + ']: (' + this.db[key].data + ')');
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
                    "tags":this.db[key].tags,
                    "op":this.db[key].op
                };
            }
        }
        return out;
    }
    updateDB() {
        fs.writeFile(this.filepath, JSON.stringify(this.db, null, 4), (err) => {
            if(err) throw err;
        });
    }
}
