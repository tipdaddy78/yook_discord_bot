const logger = require('./logger.js');

module.exports = class Parse
{
    static links(links)
    {
        let out = [];
        for(let key in links)
        {
            if(links[key])
            {
                out.push('[' + key + '](<' + links[key].data
                    + '>) Posted by ' + links[key].op
                    + '\ntags: ' + links[key].tags);
            }
        }
        out.sort();
        return out;
    }
    static tags(links)
    {
        let out = [];
        for(let l in links)
        {
            for(let t of links[l].tags)
            {
                if(!out.includes(t))
                {
                    out.push(t);
                }
            }
        }
        out.sort();
        return out;
    }
}
