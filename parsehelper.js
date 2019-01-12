const logger = require('./debug.js');

module.exports = class Parse
{
    static links(links)
    {
        let out = [];
        for(let key in links)
        {
            out.push('[' + key + '](' + links[key].data
                + ') Posted by ' + links[key].op
                + '\ntags: ' + links[key].tags);
        }
        return out;
    }
}
