const logger = require('../Logger.js');
const cmdList = require('./commands.json');


module.exports = class Command
{
    constructor(cmd_str)
    {
        this.cmd_str = cmd_str;
    }
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
    static exists(cmd_str)
    {
        return cmdList.hasOwnProperty(cmd_str);
    }
    static list()
    {
        let out = [];
        for(let c in cmdList)
        {
            out.push(`!${c}`);
        }
        return out;
    }
}
