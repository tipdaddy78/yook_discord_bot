
const {transports, createLogger, format} = require('winston');
const {combine, timestamp, label, printf} = format;

const logformat = printf(info => {
    return `${info.timestamp} : ${info.message}`;
});

const logger = createLogger({
    format: combine(
        // label({label:'Client'}),
        timestamp(),
        logformat
    ),
    transports: [
        new transports.Console()
    ]
});
logger.level = 'debug';
logger.info('Begin log...');

module.exports = logger;
