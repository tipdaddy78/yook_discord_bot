const event = require('events');
const cmdList = require('./commands.json');


module.exports = class Command extends event
{
    constructor(cmd_str)
    {
        this.cmd_str = cmd_str;
    }

    //Interface methods, must be implemented
    execute(opt)
    {
        throw Error(`Command has no execute implementation!`);
    }
    exit(msg)
    {
        throw Error(`Command has no exit implementation!`);
    }

    //Inherited getters, must not be overridden
    get()
    {
        return cmdList[this.cmd_str];
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

    //Static methods
    static exists(cmd_str)
    {
        return cmdList.hasOwnProperty(cmd_str);
    }
    static list()
    {
        let out = [];
        for(let c in cmdList)
        {
            out.push(c);
        }
        return out;
    }
}
