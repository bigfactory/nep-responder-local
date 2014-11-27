var fs = require('fs');
var path = require('path');
var mime = require('mime');


module.exports = function(req, res, next, data) {
    var options = data.options;
    var pattern = data.pattern;
    var log = data.log;

    var file = options.file;
    var url = req.url;
    var charset = options.charset || 'utf-8';
    var buffer;

    url = url.replace(/\?.*$/, '');

    var target = url.replace(pattern, '');
    target = path.join(options.file, target);

    if (!fs.existsSync(target)) {
        var msg = 'file not exists : ' + target;
        log.error(msg);
        res.status(500).send(msg);
        return;
    }

    res.setHeader('Content-Type', mime.lookup(target)+'; charset='+charset);
    buffer = fs.readFileSync(target);
    res.send(buffer);

    next();
};