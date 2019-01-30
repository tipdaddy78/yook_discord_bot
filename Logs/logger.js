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
    getOutput(msg)
    {
        return `${timestamp()} Message: ${msg}`;
    }
    logToConsole(msg)
    {
        this.loggers.console.log(this.getOutput(msg));
    }
    logToFile(msg)
    {
        this.loggers.logfile.log(this.getOutput(msg));
    }
    errToConsole(msg)
    {
        this.loggers.console.error(this.getOutput(msg));
    }
    errToFile(msg)
    {
        this.loggers.logfile.error(this.getOutput(msg));
    }
    info(msg)
    {
        this.loggers.console.log(this.getOutput(msg));
        this.loggers.logfile.log(this.getOutput(msg));
    }
    error(msg)
    {
        this.loggers.console.error(this.getOutput(msg));
        this.loggers.logfile.error(this.getOutput(msg));
    }
}

var timestamp = () =>
{
    let now = new Date(Date.now());
    let t_str = t => t.toString().padStart(2,'0');
    let hours = t_str(now.getHours());
    let mins = t_str(now.getMinutes());
    let secs = t_str(now.getSeconds());
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    return `${year}-${month}-${day} ${hours}:${mins}:${secs}`;
}

const logger = new Logger({logfile:'./Logs/inept.log',errfile:'./Logs/crash.log'});

module.exports = logger;
