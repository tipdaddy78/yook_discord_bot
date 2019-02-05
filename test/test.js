
const event = require('events');
const https = require('https');
const stdio = {cin:process.stdin,cout:process.stdout};

var YL = require('../Database/YLSRC.json');
var SRC = 'https://www.speedrun.com/api/v1';
const {Console} = require('console');

console.log(`Fetching All Bosses`);


var retrieveData = new event();


function getWR(cat)
{
    let parsedData = null;
    https.get(`${SRC}/leaderboards/${YL.id}/category/${YL.cat[cat]}`, (res) =>
    {
        let rawData = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () =>
        {
            try
            {
                console.log('parsing data...')
                parsedData = JSON.parse(rawData).data.runs[0].run.weblink;
                retrieveData.emit('data', parsedData);
            }
            catch(e)
            {
                console.log(e);
            }
        });
    });
    // while(!req.finished);
    // return parsedData.data.runs[0];
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

retrieveData.on('data', (wr) => {
    console.log(wr);
});

function readConsole()
{
    stdio.cin.on('readable', () =>
    {
        let chunk;
        while((chunk = stdio.cin.read()) !== null)
        {
            let args = input(chunk);
            switch(args[0])
            {
                case 'quit': process.exit(); break;
                default:
                getWR(args[0]);
                break;
            }
        }
    });
}
readConsole();
