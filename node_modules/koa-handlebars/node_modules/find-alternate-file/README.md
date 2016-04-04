find-alternate-file
-------------------

Say your are looking for index.html, but if it does not exist you are willing
to use index.jade, index.ejs or index.dust. This module will help you determine
which if any of the alternate files exist.

install
-------

```bash
npm install find-alternate-file
```

usage
-----

###async

```js
var find = require('find-alternate-file');

find('index.html', ['jade', 'ejs', 'dust'], function (err, found) {
	console.log(found);
});

```
###sync

```js
var findSync = require('find-alternate-file').findSync;

console.log(findSync('index.html', ['jade', 'ejs', 'dust']));
```

license
-------

MIT
