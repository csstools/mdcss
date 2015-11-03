var fs     = require('fs-promise');
var marked = require('marked');
var path   = require('path');

var isDoc  = /^\s*-{3,}\n(?:([\W\w]*?)\n\s*-{3,})?/;
var isMeta = /([A-z][\w-]*)\s*:\s*([\w-][^\n]*)/g;

module.exports = require('postcss').plugin('mdcss', function (opts) {
	// set options object
	opts = Object(opts);

	// set theme
	opts.theme = opts.theme || require('mdcss-theme-github');

	// set index
	opts.index = opts.index || 'index.html';

	// throw if theme is not a function
	if (typeof opts.theme !== 'function') throw Error('The theme failed to load');

	// conditionally set theme as executed theme
	if (opts.theme.type === 'mdcss-theme') opts.theme = opts.theme();

	// set destination path
	opts.destination = path.join(process.cwd(), opts.destination || 'styleguide');

	// return plugin
	return function (css) {
		// set documentation list, hash, and unique identifier
		var list = [];
		var hash = {};
		var uniq = 0;

		// walk comments
		css.walkComments(function (comment) {
			// if comment is documentation
			if (isDoc.test(comment.text)) {
				// set documentation
				var doc = {};

				// filter documentation meta
				doc.content = marked(comment.text.replace(isDoc, function (isDoc0, metas) {
					// push meta to documentation
					if (metas) metas.replace(isMeta, function (isMeta0, name, value) {
						doc[name] = value.trim();
					});

					// remove meta from documentation content
					return '';
				}, opts.marked).trim());

				// set documentation context
				doc.context = comment;

				// conditionally set documentation name
				if (doc.title && !doc.name) doc.name = titleToName(doc.title);

				// insure documentation has unique name
				var name = doc.name || 'section' + --uniq;
				var uniqname = name;

				while (uniqname in hash) uniqname = name + --uniq;

				// push documentation to hash
				hash[uniqname] = doc;
			}
		});

		// walk hashes
		Object.keys(hash).forEach(function (name) {
			// set documentation
			var doc = hash[name];

			// if documentation has a parent section
			if ('section' in doc) {
				// get parent section
				var title  = doc.section;
				var sname  = titleToName(title);
				var parent = hash[sname];

				// if parent section does not exist
				if (!parent) {
					// create parent section
					parent = hash[sname] = {
						title: title,
						name:  sname
					};

					// add parent section to list
					list.push(parent);
				}

				if (!parent.children) parent.children = [];

				// make documentation a child of the parent section
				parent.children.push(doc);

				doc.parent = parent;
			}
			// otherwise make documentation a child of list
			else list.push(doc);
		});

		// return theme executed with parsed list, destination
		return opts.theme({
			list: list,
			opts: opts
		}).then(function (docs) {
			return Promise.all([
				fs.copy(docs.assets, opts.destination),
				fs.writeFile(path.join(opts.destination, opts.index), docs.template)
			]);
		});
	};
});

function titleToName(title) {
	return title.replace(/\s+/g, '-').replace(/[^A-z0-9_-]/g, '').toLowerCase();
}
