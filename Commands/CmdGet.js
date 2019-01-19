const logger = require('../logger.js');
const Command = require('./Commands.js');
var linksDB = require('../Database/Database.js');

module.exports = class CmdGet extends Command
{
    constructor(link)
    {
        super('get');
        this.link = link;
    }
    execute(opt)
    {
        switch(opt)
        {
            case 'link': case 'l': default:
            return  this.exit(this.output(this.link, linksDB.getEntry(this.link)));
        }
    }
    exit(msg)
    {
        return {ch:'ch',msg:msg};
    }
    output(key, value)
    {
        return  linksDB.exists(key)?
                (`[${key}](<${value.data})`
                + `\nPosted by ${value.op}`
                + `\ntags: ${value.tags.join(', ')}}`)
                : this.message('notfound');
    }
}
