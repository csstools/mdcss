module.exports = require('postcss').plugin('mdcss', function (opts) {
	opts = opts || {};

	opts.theme = opts.theme || require('mdcss-theme-github');

	return function (css, result) {
		if (typeof opts.theme === 'function') opts.theme(css, opts, process.cwd());
		else result.warn('The theme failed to load.');
	};
});
