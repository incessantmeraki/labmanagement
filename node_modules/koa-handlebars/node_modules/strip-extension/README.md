# strip-extension

Strip extension from a path. Also works when query parameters are involved.

## Install

```
npm install strip-extension --save
```

## Usage

```js
var stripExtension = require('strip-extension');

var pathname = '/some/path/to/file.html?param=test';

console.log(stripExtension(pathname)); // OUTPUT: /some/path/to/file?param=test
```

## Run Tests

```
npm install
npm test
```
