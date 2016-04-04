var stripExtension = require('./index.js');
var test = require('tape');

test('strips extension from path', function (t) {
  
  var basicUrl = '/index.html';
  var deepUrl = '/some/path/to/file.html';
  var fullUrl = 'http://example.com/about.html';
  
  t.equal(stripExtension(basicUrl), '/index', 'removed extension from basic url');
  t.equal(stripExtension(deepUrl), '/some/path/to/file', 'removed extension from deep url');
  t.equal(stripExtension(fullUrl), 'http://example.com/about', 'removed extension from full url');
  
  t.end();
});

test('strips extension from path with query parameters', function (t) {
  
  var basicUrl = '/index.html?param=test';
  var deepUrl = '/some/path/to/file.html?param=test';
  var fullUrl = 'http://example.com/about.html?param=test';
  
  t.equal(stripExtension(basicUrl), '/index?param=test', 'removed extension from basic url');
  t.equal(stripExtension(deepUrl), '/some/path/to/file?param=test', 'removed extension from deep url');
  t.equal(stripExtension(fullUrl), 'http://example.com/about?param=test', 'removed extension from deep url');
  
  t.end();
});

test('does nothing if there is no extension', function (t) {
  
  var extlessUrl = '/no/ext?param=test';
  
  t.equal(stripExtension(extlessUrl), '/no/ext?param=test', 'returns same value');
  
  t.end();
});