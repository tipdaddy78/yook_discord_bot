const Command = require('./Commands.js');

module.exports = class CmdHelp extends Command
{
    constructor(arg)
    {
        super('help');
        this.cmd = arg;
        this.ch = 'dm';
    }
    set cmd(cmd)
    {
        this.command = cmd?
            new Command(cmd[0]==='!'?
            cmd.substring(1) : cmd);
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
            let out = roles = ch = clist = [];
            if(this.cmd.roles.length > 0)
            {
                this.cmd.roles.forEach(r => roles.push(`\`${r}\``));
                out.push('You must have one of these roles: ');
                out.push(roles.join(', '));
            }
            this.cmd.channels.forEach(c => ch.push(`\`${c}\``));
            Command.list().forEach(c => clist.push(`\`${c}\``));
            this.cmd.help.forEach(h => out.push(h));
            out.push('This command works in:');
            out.push(`${ch.join(', ')} channels`);
            out.push('List of commands:');
            out.push(clist.join(', '));
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
