const Command = require('./Commands.js');

module.exports = class CmdHelp extends Command
{
    constructor(arg)
    {
        super('help');
        this.cmd = arg.toLowerCase();
        this.ch = 'dm';
    }
    set cmd(cmd)
    {
        this.command = cmd?
            new Command(cmd[0]==='!'?
            cmd.substring(1) : cmd)
            : this;
    }
    get cmd()
    {
        return this.command;
    }
    execute()
    {
        if(Command.exists(this.cmd.str))
        {
            let out =  ['**Usage:**'];
            this.cmd.help.forEach(h => out.push(h));

            let ch = this.cmd.channels.map(c => `\`${c}\``);
            let clist = Command.list().map(cmd => `\`!${cmd}\``);

            out.push('This command works in:');
            out.push(`${ch.join(', ')} channels\n`);
            if(this.cmd.roles.length > 0)
            {
                let roles = this.cmd.roles.map(r => `\`${r}\``)
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
