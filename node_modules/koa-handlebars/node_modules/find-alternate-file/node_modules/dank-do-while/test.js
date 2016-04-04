var doWhile = require('./');

exports['the-test'] = function (test) {
	var a = [], x = 0;

	doWhile(function (next) {
		a.push(x++);

		return next(x < 4);
	}, function () {
		test.deepEqual(a, [0,1,2,3]);
		test.done();
	});
};

exports['test-concurrency'] = function (test) {
	var a = [500, 400, 300, 200, 100, 0];
	var b = [];

	doWhile(function (next) {
		var x = a.shift();

		setTimeout(function () {
			b.push(x);
			next(!!x);
		}, x);
	}, function () {
		test.deepEqual(b, [0, 100, 200, 300, 400, 500]);
		test.done();
	}, 6);
}

exports['test-concurrency-2'] = function (test) {
	var a = [500, 400, 300, 200, 100, 0];
	var b = [];

	doWhile(function (next) {
		var x = a.shift();

		setTimeout(function () {
			b.push(x);
			next(!!x);
		}, x);
	}, function () {
		test.deepEqual(b, [400, 500, 200, 300, 0, 100]);
		test.done();
	}, 2);
}
