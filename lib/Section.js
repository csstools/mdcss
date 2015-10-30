var marked = require('marked');

var docHeaderRegex     = /^\s*-{3,}\n([\W\w]+?)\n\s*-{3,}/;
var docHeaderLineRegex = /([A-z][\w-]*)\s*:\s*([^\n]+)/g;

function titleToName(string) {
	return string.replace(/\s+/g, '_').replace(/[^A-z0-9_]/g, '').toLowerCase();
}

function Section(node) {
	var self = this;

	if (node.type === 'comment') {
		self.content  = marked(node.text.replace(docHeaderRegex, function (headerMatch, lines) {
			lines.replace(docHeaderLineRegex, function (headerLineMatch, name, value) {
				self[name] = value.trim();
			});

			return '';
		}).trim());

		if (!self.title) self.title = '';
		if (!self.name)  self.name  = titleToName(self.title);

		self.parent = self;
		self.children = [];
		self.css = node;
	} else {
		var hash = {};

		node.walkComments(function (comment) {
			if (docHeaderRegex.test(comment.text)) {
				var section = new Section(comment);

				hash[section.title] = section;
			}
		});

		self.children = [];
		self.css = node;

		Object.keys(hash).forEach(function (name) {
			var section     = hash[name];

			if ('section' in section) {
				var title  = section.section;
				var parent = hash[title];

				if (!parent) {
					parent = hash[title] = new Section(section.css.clone({ text: '' }));

					parent.title  = title;
					parent.name   = titleToName(title);

					self.children.push(parent);
				}

				parent.children.push(section);
			} else self.children.push(section);
		});
	}
}

module.exports = Section;
