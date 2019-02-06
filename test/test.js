
const https = require('https');
const stdio = {cin:process.stdin,cout:process.stdout};

var YL = require('../Database/YLSRC.json');
var URL = 'https://www.speedrun.com/api/v1/leaderboards/m1zz5210/category';
const {Console} = require('console');

console.log('Enter category:');

class WRretriever
{
    constructor(){
        this.weblink = null;
    }
    try_catch(resolve, reject, raw)
    {
        try
        {
            resolve(JSON.parse(raw).data.runs[0].run.weblink);
        }
        catch(e)
        {
            reject('Not found');
        }
    }
    parseData(response, resolve, reject)
    {
        let rawData = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => { rawData += chunk; });
        response.on('end', () => this.try_catch(resolve, reject, rawData));
    }
    get(cat)
    {
        return (new Promise((resolve,reject) =>
        {
            https.get(`${URL}/${YL[cat]}`, res => this.parseData(res, resolve, reject));
        }))
        .then(data => this.weblink = data)
        .catch(msg => this.weblink = msg);
    }
}

function input(chunk)
{
    let str = chunk.toString();
    let regx = /\b[\w]+\b/g;
    let array = output = [];
    while((array = regx.exec(str)) !== null)
    {
        output.push(array[0]);
    }
    return output;
}

let WR = new WRretriever();

function readConsole()
{
    stdio.cin.on('readable', async function()
    {
        let chunk;
        while((chunk = stdio.cin.read()) !== null)
        {
            let args = input(chunk);
            switch(args[0])
            {
                case 'quit':
                    process.exit();
                break;
                default:
                    let msg;
                    await WR.get(args[0]);
                    console.log(WR.weblink);
                break;
            }
        }
    });
}
readConsole();
