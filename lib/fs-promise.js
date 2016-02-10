var slice = Array.prototype.slice;
var fs = require('fs-extra');

[
	'access',
	'readFile',
	'close',
	'open',
	'read',
	'write',
	'rename',
	'truncate',
	'ftruncate',
	'rmdir',
	'fdatasync',
	'fsync',
	'mkdir',
	'readdir',
	'fstat',
	'lstat',
	'stat',
	'readlink',
	'symlink',
	'link',
	'unlink',
	'fchmod',
	'lchmod',
	'chmod',
	'lchown',
	'fchown',
	'chown',
	'_toUnixTimestamp',
	'utimes',
	'futimes',
	'writeFile',
	'appendFile',
	'realpath',
	'lutimes',
	'gracefulify',
	'copy',
	'mkdirs',
	'mkdirp',
	'ensureDir',
	'remove',
	'readJson',
	'readJSON',
	'writeJson',
	'writeJSON',
	'outputJson',
	'outputJSON',
	'move',
	'createOutputStream',
	'emptyDir',
	'emptydir',
	'createFile',
	'ensureFile',
	'createLink',
	'ensureLink',
	'createSymlink',
	'ensureSymlink',
	'outputFile',
	'walk'
].forEach(function (key) {
	module.exports[key] = function () {
		var args = slice.call(arguments);

		return new Promise(function (resolve, reject) {
			args.push(function(error, response) {
				if (error) {
					console.log(['error', error]);
					reject(error);
				} else {
					resolve(response);
				}
			});

			fs[key].apply(fs, args);
		});
	};
});
