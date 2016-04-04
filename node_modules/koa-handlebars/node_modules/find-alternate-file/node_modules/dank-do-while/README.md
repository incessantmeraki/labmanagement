node-dank-do-while
---------------

An asynchronous do-while-like function for node

install
-------

```bash
npm install dank-do-while
```

method
------

### doWhile(eachFunction, doneFunction, concurrency);

**eachFunction** will be called once initially and then again
  for each time that `next(truthy)` is called

  Signature is `function(next)`

**doneFunction** will be called once when `next(falsy)` is called

**concurrency** the number of concurrent **eachFunction**'s that may be executed

example
-------

```javascript
var doWhile = require('dank-do-while');

doWhile(function (next) {	
	someAsyncFunction(function (err, result) {
		return next(result !== 'done');
	});
}, function () {
	console.log('done');
});
```

license
----------

### The MIT License (MIT)


Copyright (c) 2014 Dan VerWeire

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

