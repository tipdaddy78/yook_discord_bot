const H = require('./header.js');

module.exports = class CmdHelp extends H.Command
{
    constructor(args)
    {
        super('help');
        this.cmd = args[0]?args[0].toLowerCase():this.str;
        this.ch = 'dm';
    }
    set cmd(cmd)
    {
        this.command = cmd?
            new H.Command(cmd[0]==='!'?
            cmd.substring(1) : cmd)
            : this;
    }
    get cmd()
    {
        return this.command;
    }
    execute()
    {
        if(H.Command.exists(this.cmd.str))
        {
            let out =  ['**Usage:**'];
            this.cmd.help.forEach(h => out.push(h));

            let ch = this.cmd.channels.map(c => `\`${c}\``);
            let clist = H.Command.list().map(cmd => `\`!${cmd}\``);

            out.push('This command works in:');
            out.push(`${ch.join(', ')} channels\n`);
            if(this.cmd.roles.length > 0)
            {
                let roles = this.cmd.roles.map(r => `\`${r}\``);
                out.push('You must have one of these roles: ');
                out.push(`${roles.join(', ')}\n`);
            }
            out.push('List of commands:');
            out.push(`${clist.join(', ')}`);
            return this.exit(out);
        }
        else
        {
            this.cmd = 'help';
            return this.execute();
        }
    }
    exit(msg)
    {
        return {ch:this.ch,msg:msg}
    }
}
