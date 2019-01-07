const fs = require('fs');

module.exports = class Database {
    constructor(json) {
        this.db = json;
    }
    add(name, data) {
        this.db[name] = data;
        fs.writeFile('./links.json', JSON.stringify(this.db), (err) => {
            if(err) throw err;
        });
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
