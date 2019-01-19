const logger = require('../logger.js');
const Command = require('./Commands.js');
var linksDB = require('../Database/Database.js');

module.exports = class CmdGet extends Command
{
    constructor(args)
    {
        super('get');
        this.link = args[0];
    }
    execute(opt)
    {
        let regex = new RegExp('^' + this.link + '\\b','i');
        let entry = linksDB.find(k => k.match(regex));
        let key = entry[0];
        entry = entry[1];
        switch(opt)
        {
            case 'link': case 'l': default:
            return  this.exit(this.output(key, entry));
        }
    }
    exit(msg)
    {
        return {ch:'ch',msg:msg};
    }
    output(key, value)
    {
        return  key && value?
                (`[${key}](${value.data})`
                + `\nPosted by ${value.op}`
                + `\ntags: ${value.tags.join(', ')}`)
                : this.message('notfound');
    }
}
