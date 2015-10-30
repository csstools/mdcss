var Documentation = require('./Documentation.js');

module.exports = require('postcss').plugin('mdcss', function (opts) {
	opts = opts || {};

	opts.theme       = opts.theme || require('mdcss-theme-github');
	opts.destination = process.cwd() + '/' + (opts.destination || 'styleguide');

	return function (css, result) {
		var documentation = new Documentation(css);

		if (typeof opts.theme === 'function') opts.theme = opts.theme();

		if (typeof opts.theme === 'object' && typeof opts.theme.process === 'function') return opts.theme.process(documentation, opts.destination, result);
		else result.warn('The theme failed to load.');
	};
});
