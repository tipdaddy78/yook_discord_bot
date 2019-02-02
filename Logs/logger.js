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
        this.loggers.logfile.trace(msg);
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

function cur_date(now)
{
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    return `${year}-${month}-${day}`;
}
function cur_time(now)
{
    let t_str = t => t.toString().padStart(2,'0');
    let hours = t_str(now.getHours());
    let mins = t_str(now.getMinutes());
    let secs = t_str(now.getSeconds());
    return `${hours}:${mins}:${secs}`;
}
var timestamp = () =>
{
    let now = new Date(Date.now());
    return `${cur_date(now)} ${cur_time(now)}`;
}

function check(fname)
{
    var val = -1;
    var date = `${cur_date(new Date(Date.now()))}`;
    var path;
    do
    {
        val++;
        path = `./Logs/${date}_${fname}${val!==0?`(${val})`:''}.log`;
    }
    while(fs.existsSync(path));
    return path
}



const logger = new Logger({logfile:check('inept'),errfile:check('crash')});

module.exports = logger;
