var fs = require('fs')
	, extname = require('path').extname
	, basename = require('path').basename
	, dirname = require('path').dirname
	, join = require('path').join
	, doWhile = require('dank-do-while')
	;

module.exports = find;
module.exports.find = find;
module.exports.findSync = findSync;

function find(path, extensions, cb) {
	var stat, i, dir, base, ext, found;

	if (typeof extensions === 'function') {
		cb = extensions;
		extensions = null;
	}

	extensions = normalize(extensions);

	check(path, function (err, result) {
		if (result) {
			return cb(null, path);
		}

		i = 0;
		dir = dirname(path);
		base = basename(path);
		ext = extname(base);
		base = basename(base, ext);

		doWhile(function (next) {
			ext = extensions[i++];

			if (!ext) {
				path = null;
				return next(false);
			}

			if (ext.substr(0,1) != '.') {
				ext = '.' + ext;
			}

			path = join(dir, base + ext);

			check(path, function (err, stat) {
				found = stat && !stat.isDirectory();

				return next(!found)
			});

		}, function () {
			//done;
			if (!found) {
				path = null;
			}

			return cb(null, path);
		});
	});

	function check(path, cb) {
		fs.stat(path, function (err, stat) {
			return cb(null, stat);
		});
	}
}

function findSync(path, extensions) {
	//first check if path exists;
	var ck, i, dir, base, ext, stat;
	
	extensions = normalize(extensions);

	stat = check(path);

	if (stat && !stat.isDirectory()) {
		return path;
	}

	dir = dirname(path);
	base = basename(path);
	ext = extname(base);
	base = basename(base, ext);

	//else keep looking
	for (i = 0; i < extensions.length; i++) {
		ext = extensions[i];

		if (ext.substr(0,1) != '.') {
			ext = '.' + ext;
		}

		path = join(dir, base + ext);

		stat = check(path);

		if (stat && !stat.isDirectory()) {
			return path;
		}
	}

	return null;

	function check(path) {
		var stat;

		try {
			stat = fs.statSync(path);
		}
		catch (e) {}

		return stat;
	}
}

/**
 * Normalize a list of file extensions
 */

function normalize(list) {
	if (!list) return [];
	if (!Array.isArray(list)) return [list];
	return list;
}
