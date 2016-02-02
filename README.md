## nep-responder-local


## Usage

```
var nep_responder_local = require('nep-responder-local');


```

## Config

```
{
  pattern: /https?\:abc\.com)\/(\?\?)?path\/to\/your/\file\//,
  responder: 'local',
  options: {
  	file: '/www/your/local/build',
	noMin: true,
	index: 'index.js'
  }
}

```

- pattern: 必选，匹配的正则表达式，如需支持 CDN 文件合并，记得中间添加 `(\?\?)?` 的正则语句
- responder: 必选，写local即可，若本地有多个node版本，可以写成: `require('/path/to/your/global/node_modules/nep-responder-local/')`
- options.file：必选，需要查找的文件名，或者路径。
- options.noMin：可选，开启了 `noMin` 会自动去掉 `-min` 后缀再去匹配本地路径
- options.index：可选，当目标文件为目录时，会自动被上 `options.index` 作为最终目标文件
