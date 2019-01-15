const fs = require('fs');
const {Console} = require('console');

class Logger
{
    constructor(loginfo)
    {
        this.loggers =
        {
            console:
                (new Console
                    ({
                        stdout:process.stdout,
                        stderr:process.stderr
                    })
                ),
            logfile:
                (new Console
                    ({
                        stdout:fs.createWriteStream(loginfo.logfile),
                        stderr:fs.createWriteStream(loginfo.errfile)
                    })
                )
        }
    }
    get timestamp()
    {
        var t = new Date(Date.now());
        return t.getFullYear() + '-'
            + (t.getMonth() + 1) + '-'
            + t.getDate() + '::'
            + t.getHours().toString().padStart(2,'0') + ':'
            + t.getMinutes().toString().padStart(2,'0') + ':'
            + t.getSeconds().toString().padStart(2,'0');
    }
    info(msg)
    {
        var out = {timestamp:this.timestamp,message:msg};
        this.log(out);
    }
    error(msg)
    {
        var out = {timestamp:this.timestamp,message:msg};
        this.err(out);
    }
    log(msg)
    {
        this.loggers.console.log(msg);
        this.loggers.logfile.log(msg);
    }
    err(msg)
    {
        this.loggers.console.error(msg);
        this.loggers.logfile.error(msg);
    }
}

const logger = new Logger({logfile:'./Logs/inept.log',errfile:'./Logs/crash.log'});

module.exports = logger;
