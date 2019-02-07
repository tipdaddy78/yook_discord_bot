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
    exit(msg, ch)
    {
        return {ch:ch?ch:this.ch,msg:msg};
    }
    execute()
    {
        let option = arguments[0];
        let callback = arguments[2];
        switch(option)
        {
            case 'catlist': case 'cl': case 'clist':
            callback(this.catList());
            break;
            default:
            this.getWR(callback);
            break;
        }
    }
    getWR(callback)
    {
        let handleExceptions = (raw, res, rej) =>
        {
            try
            {
                res(JSON.parse(raw).data.runs[0].run.weblink);
            }
            catch(e)
            {
                H.Logger.info(e);
                rej('notfound');
            }
        }
        let wr = new Promise((resolve, reject) =>
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
        .catch(e => callback(this.exit(this.message(e))));
    }
    catList()
    {
        let list = [];
        for(let key in YL)
        {
            list.push(YL[key].join(', '));
        }
        return this.exit(list.join('\n'), 'dm');
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
