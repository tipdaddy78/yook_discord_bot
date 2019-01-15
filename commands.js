const cmdList = require('./commands.json');
const logger = require('./logger.js');


module.exports = class Command
{
    constructor(cmd_str)
    {
        this.cmd_str = cmd_str;
    }
    exists()
    {
        return cmdList.hasOwnProperty(this.cmd_str);
    }
    get()
    {
        return cmdList[this.cmd_str];
    }
    static list()
    {
        let out = [];
        for(let c in cmdList)
        {
            if(c != 'invalid')
            {
                out.push('!' + c);
            }
        }
        return out;
    }
    get str()
    {
        return this.cmd_str;
    }
    get help()
    {
        return this.get().help;
    }
    get channels()
    {
        return this.get().channels;
    }
    get roles()
    {
        return this.get().roles;
    }
    message(msg)
    {
        return this.get().message[msg];
    }
}
