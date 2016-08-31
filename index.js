var fs     = require('fs'),
	fsp    = require('fs-promise'),
	marked = require('marked'),
	path   = require('path');

var isDoc = /\/*-{3}([\s\S]*?)-{3,}/;
var isMeta = /([A-z][\w-]*)[ \t]*:[ \t]*([\w\-\.\/][^\n]*)/g;

module.exports = require('postcss').plugin('mdcss', function (opts) {
	/* set options object */
	opts = Object(opts);

	/* set options */
	opts.index = opts.index || 'index.html'; // index file
	opts.contentFile = opts.contentFile || 'content.html'; // content file
	opts.theme = opts.theme || require('mdcss-theme-github'); // theme or default
	opts.destination = path.join(process.cwd(), opts.destination || 'styleguide'); // destination path
	opts.assets = (opts.assets || []).map(function (src) {
		return path.join(process.cwd(), src);
	}); // additional assets path
	opts.markdownFiles = opts.markdownFiles || 'markdown'; // markdown import files
	if (typeof opts.theme !== 'function') throw Error('The theme failed to load'); // throw if theme is not a function
	if (opts.theme.type === 'mdcss-theme') opts.theme = opts.theme(opts); // conditionally set theme as executed theme

	/* return plugin */
	return function (css, result) {
		// set current css directory or current directory
		var dir = css.source.input.file ? path.dirname(css.source.input.file) : process.cwd();

		// set documentation list, hash, and unique identifier
		var list = [];
		var hash = {};
		var uniq = 0;
		
		/* process documentation comments */
		css.walkComments(function (comment) {
			// check if comment matches documentation regex, ignore if it doesn't
			if (isDoc.test(comment.text)) {
				var doc = {}; // documentation object

				// filter documentation meta
				doc.content = comment.text.replace(isDoc, function (isDoc0, metas) {
					// push meta to documentation
					if (metas) metas.replace(isMeta, function (isMeta0, name, value) {
						doc[name] = value.trim();
					});

					// remove meta from documentation content
					return '';
				}).trim();

				// conditionally set the closest documentation name
				if (doc.title && !doc.name) { doc.name = doc.title; }

				// if theres no inline/imported markdown specified, look for it...
				if (!doc.content) {
					// get comment source path
					var src = comment.source.input.file;

					// if the comment source path exists
					if (src) {
						// get the closest matching directory for this comment
						var localdir = src ? path.dirname(src) : dir,
							mdbase = doc.import,
							mdspec;

						// if there's no import specified, look for a .md file with the title name inside the section folder
						if (!mdbase) {
							var mdFiles = opts.markdownFiles,
								mdSection = doc.section.replace(" ", "-").toLowerCase(),
								mdName = mdspec = doc.title.replace(" ", "-").toLowerCase();

							// look for md file in format of markdown/section/title.md
							mdbase = mdFiles + "\/" + mdSection + "\/" + mdName + ".md";

							// if document has name look for title.name.md file
							if (doc.name) {
								mdspec += '.' + doc.name.toLowerCase() + ".md";
							}
						}

						// try to read the closest matching documentation
						try {
							// if using title.name.md method
							if (mdspec) {
								doc.content = marked(fs.readFileSync(path.join(localdir, mdspec), 'utf8'));
							} else throw new Error();
						} catch (error1) {
							// then try using markdown/section/title.md
							try {
								doc.content = marked(fs.readFileSync(path.join(localdir, mdbase), 'utf8'));
							} catch (error2) {
								doc.content = '';
								comment.warn(result, 'Documentation import "' + mdbase + '" could not be read.');
							}
						}
					}
				}

				doc.content = marked(doc.content, opts.marked); // convert doc object to markdown
				doc.context = comment; // set documentation context

				// insure documentation has unique name
				var name = doc.name || 'section' + ++uniq;
				var uniqname = name;

				while (uniqname in hash) uniqname = name + --uniq;

				// push documentation to hash
				hash[uniqname] = doc;
			}
		});

		/* walk hashes */
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

		/* return theme executed with parsed list and destination */
		return opts.theme({
			list: list,
			opts: opts
		}).then(function (docs) {
			// empty the destination directory
			return fsp.emptyDir(opts.destination)
			// then copy the theme assets into the destination
			.then(function () {
				return fsp.copy(docs.assets, opts.destination);
			})

			// then copy the compiled template into the destination
			.then(function () {
				return fsp.outputFile(path.join(opts.destination, opts.index), docs.template);
			})
			// then copy any of the additional assets into the destination
			.then(function () {
				return Promise.all(opts.assets.map(function (src) {
					return fsp.copy(src, path.join(opts.destination, path.basename(src)));
				}));
			});
		});
	};
});

function titleToName(title) {
	return title.replace(/\s+/g, '-').replace(/[^A-z0-9_-]/g, '').toLowerCase();
}