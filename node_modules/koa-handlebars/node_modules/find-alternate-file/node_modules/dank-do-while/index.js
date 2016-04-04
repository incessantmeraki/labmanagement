// usage:
//
// doWhile(function (next) {
//   doAsyncThing(function (err, result) {
//     //passing truthy to next() will call this anonymous function again
//     //passing falsy to next() will call the done function (if exists)
//     return next(result !== 'done');  
//   });
// }
// , function () {
//   return cb()
// }, 3) //concurrency
//

module.exports = function doWhile (fn, done, concurrent) {
  var pending = 0;
  var end = false;
  concurrent = concurrent || 1;

  for (var x = 0; x < concurrent; x++) {
    run(fn)
  }
  
  function run (fn) {
    setImmediate(function() {
      pending += 1;
      fn(function (cont) {
        pending -= 1;

        if (!cont) {
          end = true;
        }

        if (!end) {
          run(fn)
        }
        else if (end && pending === 0) {
          done();
        }
      })
    })
  }
};
