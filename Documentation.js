var marked = require('marked');

var headerRegex     = /^\s*-{3,}\n([\W\w]+?)\n\s*-{3,}/;
var headerLineRegex = /([A-z][\w-]*)\s*:\s*([^\n]+)/g;

function titleToName(string) {
	return string.replace(/\s+/g, '_').replace(/[^A-z0-9_]/g, '').toLowerCase();
}

function Documentation(node) {
	var self = this;

	if (node.type === 'comment') {
		self.content  = marked(node.text.replace(headerRegex, function (headerMatch, lines) {
			lines.replace(headerLineRegex, function (headerLineMatch, name, value) {
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
			if (headerRegex.test(comment.text)) {
				var section = new Documentation(comment);

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
					parent = hash[title] = new Documentation(section.css.clone({ text: '' }));

					parent.title  = title;
					parent.name   = titleToName(title);

					self.children.push(parent);
				}

				parent.children.push(section);
			} else self.children.push(section);
		});
	}
}

module.exports = Documentation;
