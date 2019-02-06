const H = require('./header.js');
const https = require('https');
const YL = require('../Database/YLSRC.json');
const URL = 'https://www.speedrun.com/api/v1/leaderboards/m1zz5210/category'

module.exports = class CmdWR extends H.Command
{
    constructor(args)
    {
        super('wr');
        this.cat = args[0];
        this.ch = 'ch';
        H.Logger.info('CatID: ' + YL[this.cat]);
    }
    exit(msg)
    {
        return {ch:this.ch,msg:msg};
    }
    async execute()
    {
        let callback = arguments[2];
        await this.getWR()
        .then(data => callback(this.exit(data)))
        .catch(e => callback(this.exit(this.message('notfound'))));
    }
    getWR()
    {
        return new Promise((resolve,reject) =>
        {
            https.get(`${URL}/${YL[this.cat]}`, res =>
            {
                let rawData = '';
                res.setEncoding('utf8');
                res.on('data', (chunk) => { rawData += chunk; });
                res.on('end', () =>
                {
                    try
                    {
                        H.Logger.info('Parsing...');
                        resolve(JSON.parse(rawData).data.runs[0].run.weblink);
                    }
                    catch(e)
                    {
                        H.Logger.info(e);
                        reject('Not found');
                    }
                });
            });
        });
    }
}
