var Document = require('./lib/Document.js');
var ejs      = require('ejs');
var fs       = require('fs-promise');
var path     = require('path');
var postcss  = require('postcss');

module.exports = postcss.plugin('mdcss', function (opts) {
	opts = opts || {};

	opts.destination = path.resolve(opts.destination || 'styleguide');
	opts.template    = path.resolve(opts.template    || 'default-template');

	return function (css) {
		return new Promise(function (resolve, reject) {
			var document = new Document(css);

			fs.readFile(opts.template + '/index.html.ejs', 'utf8').then(function (contents) {
				var template = ejs.compile(contents);
				var buffer   = template(document);

				fs.copy(opts.template, opts.destination).then(function () {
					return fs.remove(opts.destination + '/index.html.ejs');
				}).then(function () {
					return fs.writeFile(opts.destination + '/index.html', buffer);
				}).then(resolve, reject);
			});
		});
	};
});
