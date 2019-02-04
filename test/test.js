var https = require('https');
var api = 'http://speedrun.com/api/v1';
var yl = 'm1zz5210';
var any_w_flight = '7kjzy44d';
const {Console} = require('console');
var console = new Console({stdout:process.stdout,stderr:process.error});

https.get(`https://www.speedrun.com/api/v1/leaderboards/m1zz5210/category/7kjzy44d`, (res) => {
  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(JSON.stringify(parsedData, null, 2));
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
