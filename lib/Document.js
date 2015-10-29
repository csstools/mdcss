var Comment = require('./Comment.js');

module.exports = function (css) {
	var self = this;
	var hash = {};

	self.children = [];

	css.walkComments(function (node) {
		if (Comment.test(node.text)) {
			var comment = new Comment(node);

			hash[comment.title] = comment;
		}
	});

	Object.keys(hash).forEach(function (name) {
		var comment = hash[name];

		if (comment.section) {
			if (!hash[comment.section]) {
				hash[comment.section] = Comment.section(comment);

				self.children.push(hash[comment.section]);
			}

			hash[comment.section].children.push(comment);
		} else self.children.push(comment);
	});
};
