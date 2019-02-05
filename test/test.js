
const event = require('events');
const https = require('https');
const stdio = {cin:process.stdin,cout:process.stdout};

var YL = require('../Database/YLSRC.json');
var SRC = 'https://www.speedrun.com/api/v1';
const {Console} = require('console');

console.log(`Fetching All Bosses`);


class WRretriever extends event
{
    constructor()
    {
        super();
        this.parsedData = null;
    }
    get()
    {
        let ret = this.parsedData;
        this.parsedData = null;
        return ret;
    }
    fetch(cat)
    {
        return (new Promise((resolve,reject) =>
        {
            https.get(`${SRC}/leaderboards/${YL.id}/category/${YL.cat[cat]}`, (response) =>
            {
                let rawData = '';
                response.setEncoding('utf8');
                response.on('data', (chunk) => { rawData += chunk; });
                response.on('end', () =>
                {
                    try
                    {
                        console.log('parsing data...')
                        resolve(JSON.parse(rawData).data.runs[0].run.weblink);
                    }
                    catch(e)
                    {
                        reject(e);
                    }
                });
            });
        }))
        .then(data =>
        {
            this.parsedData = data;
        })
        .catch(error =>
        {
            console.log(error);
        });
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

WR.on('data', (wr) => {
    console.log(wr);
});

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
                case 'quit': process.exit(); break;
                default:
                await WR.fetch(args[0]);
                console.log(WR.get());
                break;
            }
        }
    });
}
readConsole();
