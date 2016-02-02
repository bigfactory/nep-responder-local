var fs = require('fs');
var path = require('path');
var mime = require('mime');


module.exports = function(req, res, next, data) {
    
    var log = data.log;

    var options = data.options;
    var charset = options.charset || 'utf-8';
    var noMin = options.noMin;

    var pattern = data.pattern;
    var url = req.url;
    var qqIdx = url.indexOf('??');
    var requestFiles = [];
    var targets = [];

    var buffer;
    var qqPre;
    var i ;



    if(qqIdx !== -1) {

        //处理cdn合并请求多个文件的情况
        qqPre = url.substring(0,qqIdx);
        requestFiles = url.substring(qqIdx+2).split(',');
        for(i = 0; i < requestFiles.length; i++ ) {
            requestFiles[i] = qqPre + requestFiles[i];
        }

    }else {
        requestFiles[0] = url;
    }

    //去掉后面的参数
    for(i = 0; i < requestFiles.length; i++) {
        requestFiles[i] = requestFiles[i].replace(/\?.*$/, '');
    }


    if(isFile(options.file)){
        targets[0] = options.file;
    }else{
        for(i = 0; i < requestFiles.length; i++) {
            targets[i] = requestFiles[i].replace(pattern, '');

            if(noMin) {
                targets[i] = targets[i].replace(/\-min\.(\w+)$/,'.$1');
            }
            targets[i] = path.join(options.file, targets[i]);

            //如果请求的文件是目录，添加默认文件名
            if(targets[i][targets[i].length - 1] == '/' && options.index){
                targets[i] += options.index;
            }
        }
    }

    resLocalFiles(targets, res, log);

};


/**
 * [resLocalFiles with Strime]
 * @param  {[type]} files [description]
 * @param  {[type]} res   [http responer]
 */
function resLocalFiles(files, res, log){

    var stream ;
    
    // recursive function
    function main() {

        if (!files.length) {
            res.end();
            return;
        }
        // console.log('resopn local file :' + files[0]);
        stream = fs.createReadStream(files.shift());
        stream.pipe(res, {end: false});
        stream.on("end", function() {
            main();        
        });
    }

    if(files.length > 0 ) {
        res.writeHead(200, "Ok",{'Content-Type': mime.lookup(files[0]) +';charset=utf-8;'});
        main();
    } else{
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not found!');
        log.error('file not found');
    }
}


function isFile(file){
    var stat = fs.statSync(file);
    return stat.isFile();
}