var test = require('tape');
var find = require('./')
var findSync= require('./').findSync;

test('sync: basic test', function (t) {
	var result = findSync('./test.html', ['jade', 'ejs', 'js', 'dust'])
	t.equal(result, 'test.js');
	t.end();
})

test('async: basic test', function (t) {
	find('./test.html', ['jade', 'ejs', 'js', 'dust'], function (err, result) {
		t.error(err)
		t.equal(result, 'test.js')
		t.end();
	})
})

test('sync: convert extensions to array', function (t) {
	var result = findSync('./test', 'js')
	t.equal(result, 'test.js')
	t.end()
})

test('async: convert extensions to array', function (t) {
	find('./test', 'js', function (err, result) {
		t.error(err)
		t.equal(result, 'test.js')
		t.end()
	})
})

test('sync: work with or without the . prefix', function (t) {
	var result = findSync('./test', ['.jade', '.ejs', '.js', '.dust'])
	t.equal(result, 'test.js')
	t.end()
})

test('async: work with or without the . prefix', function (t) {
	find('./test', ['.jade', '.ejs', '.js', '.dust'], function (err, result) {
		t.error(err)
		t.equal(result, 'test.js')
		t.end()
	})
})

test('sync: work without extensions', function (t) {
	var result = findSync('./test.js')
	t.equal(result, './test.js')
	t.end()
})

test('async: work without extensions', function (t) {
	find('./test.js', function (err, result) {
		t.error(err)
		t.equal(result, './test.js')
		t.end()
	})
})
