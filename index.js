var Documentation = require('./Documentation.js');

module.exports = require('postcss').plugin('mdcss', function (opts) {
	opts = opts || {};

	opts.theme       = opts.theme || require('mdcss-theme-github');
	opts.destination = process.cwd() + '/' + (opts.destination || 'styleguide');

	return function (css, result) {
		var documentation = new Documentation(css);

		if (typeof opts.theme === 'function') {
			if (opts.theme.type === 'mdcss-theme') opts.theme = opts.theme();

			return opts.theme(documentation, opts.destination, result);
		} else result.warn('The theme failed to load.');
	};
});
