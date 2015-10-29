var marked = require('marked');

var docHeaderRegex     = /^\s*-{3,}\n([\W\w]+?)\n\s*-{3,}/;
var docHeaderLineRegex = /([A-z][\w-]*)\s*:\s*([^\n]+)/g;

function Comment(node) {
	var self = this;

	self.children = [];
	self.content  = marked(node.text.replace(docHeaderRegex, function (headerMatch, lines) {
		lines.replace(docHeaderLineRegex, function (headerLineMatch, name, value) {
			self[name] = value.trim();
		});

		return '';
	}).trim());

	if (!self.title) self.title = 'Section';
	if (!self.name)  self.name  = Comment.titleToName(self.title);
}

Comment.test = function (string) {
	return docHeaderRegex.test(string);
};

Comment.section = function (comment) {
	var section = new Comment({ text: '' });

	section.title = comment.section;
	section.name  = Comment.titleToName(section.title);

	return section;
};

Comment.titleToName = function (string) {
	return string.replace(/\s+/g, '_').replace(/[^A-z0-9_]/g, '').toLowerCase();
};

module.exports = Comment;
