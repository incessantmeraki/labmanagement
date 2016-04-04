var zipObject = require('zip-object');

var exports = module.exports = function stripExtension (pathname) {
  
  var u = parsePath(pathname);
  var extIndex = u.pathname.lastIndexOf('.')
  
  if (extIndex > -1) {
    var extlessPath = u.pathname.slice(0, extIndex);
    pathname = u.query ? extlessPath + '?' + u.query : extlessPath;;
  }
  
  return pathname;
}

var parsePath = exports.parsePath = function (pathname) {
  
  return zipObject(['pathname', 'query'], pathname.split('?'));
}