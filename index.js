var Section = require('./lib/Section.js');

module.exports = require('postcss').plugin('mdcss', function (opts) {
	opts = opts || {};

	opts.theme     = opts.theme     || require('mdcss-theme-github');
	opts.directory = opts.directory || 'styleguide';
	opts.template  = opts.template  || 'template.ejs';
	opts.index     = opts.index     || 'index.html';

	return function (css, result) {
		var section = new Section(css);

		if (typeof opts.theme === 'function') opts.theme(section, opts, result);
		else result.warn('The theme failed to load.');
	};
});
