const H = require('./header.js');
const https = require('https');
const YL = require('../Database/YLSRC.json');
const SRC = 'https://speedrun.com/api/v1'

class CmdWR extends H.Command
{
    constructor(args)
    {
        super();
        this.category = args[0];
    }
    exit()
    {

    }
    execute()
    {

    }
    getWR(res)
    {
        let rawData = '';
        let parsedData;
        res.setEncoding('utf8');
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
              parsedData = JSON.parse(rawData).data.runs[0];
              retrieveData.emit('data', parsedData);
            }
            catch (e);
        });
    }
}
