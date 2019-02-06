const H = require('./header.js');
const https = require('https');
const YL = require('../Database/YLSRC.json');
const URL = 'https://www.speedrun.com/api/v1/leaderboards/m1zz5210/category'

module.exports = class CmdWR extends H.Command
{
    constructor(args)
    {
        super('wr');
        this.cat = args[0]?args[0].toLowerCase():'';
        this.ch = 'ch';
    }
    exit(msg)
    {
        return {ch:this.ch,msg:msg};
    }
    execute()
    {
        let callback = arguments[2];
        let handleExceptions = (raw, res, rej) =>
        {
            try
            {
                res(JSON.parse(raw).data.runs[0].run.weblink);
            }
            catch(e)
            {
                H.Logger.info(e);
                rej('Not found');
            }
        }
        let getWR = new Promise((resolve, reject) =>
        {
            https.get(`${URL}/${this.findCat()}`, res =>
            {
                let rawData = '';
                res.setEncoding('utf8');
                res.on('data', (chunk) => { rawData += chunk; });
                res.on('end', () => handleExceptions(rawData, resolve, reject));
            });
        })
        .then(data => callback(this.exit(data)))
        .catch(e => callback(this.exit(this.message('notfound'))));
    }
    findCat()
    {
        for(let key in YL)
        {
            let bool = YL[key].some(cat => cat === this.cat);
            if(bool) return key;
        }
        return '';
    }
}
