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
            + t.getHours() + ':'
            + t.getMinutes() + ':'
            + t.getSeconds();
    }
    info(msg)
    {
        var out = {timestamp:this.timestamp,message:msg}
        this.log(out);
    }
    log(msg)
    {
        for(let l in this.loggers)
        {
            this.loggers[l].log(msg);
        }
    }
}

const logger = new Logger({logfile:'./inept.log',errfile:'./crash.log'});

module.exports = logger;
