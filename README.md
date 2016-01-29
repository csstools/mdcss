# mdcss

<img align="right" width="96" height="96" src="https://jonathantneal.github.io/mdcss-theme-github/demo/mdcss-logo.png" title="mdcss logo">

[![NPM Version][npm-img]][npm] [![Build Status][ci-img]][ci]

[mdcss] lets you easily create and maintain style guides with CSS comments using Markdown.

	/*---
	title:   Buttons
	section: Base CSS
	---

	Button styles can be applied to any element. Typically you'll want to use
	either a `<button>` or an `<a>` element:

	```example:html
	<button class="btn">Click</button>
	<a class="btn" href="/some-page">Some Page</a>
	```
	*/

	.btn {
		background-color: black;
		color: white;
	}

![screenshot](https://cloud.githubusercontent.com/assets/188426/11217538/cfeb322a-8d1e-11e5-9a64-2c5373968663.png)

## Usage

Add [mdcss] to your build tool:

```bash
npm install mdcss --save-dev
```

#### Node

```js
require('mdcss').process(YOUR_CSS, { /* options */ });
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Load [mdcss] as a PostCSS plugin:

```js
postcss([
	require('mdcss')({ /* options */ })
]);
```

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Enable [mdcss] within your Gulpfile:

```js
var postcss = require('gulp-postcss');

gulp.task('css', function () {
	return gulp.src('./css/src/*.css').pipe(
		postcss([
			require('mdcss')({ /* options */ })
		])
	).pipe(
		gulp.dest('./css')
	);
});
```

#### Grunt

Add [Grunt PostCSS] to your build tool:

```bash
npm install grunt-postcss --save-dev
```

Enable [mdcss] within your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
				require('mdcss')({ /* options */ })
			]
		},
		dist: {
			src: 'css/*.css'
		}
	}
});
```

## Options

#### `theme`

Type: `NPM Repository`  
Default: `require('mdcss-theme-github')`

The theme used by [mdcss] to create the style guide.

```js
require('mdcss')({
	theme: require('mdcss-theme-github')
})
```

Theme-specific options may also be passed in from the theme module itself, but note that any global options would then be ignored.

```js
require('mdcss')({
	theme: require('mdcss-theme-github')(/* options */)
})
```

#### `destination`

Type: `String`  
Default: `'styleguide'`

The directory to write the style guide to.

#### `assets`

Type: `Array`  
Default: `[]`

The list of files or directories to copy into the style guide directory.

#### `index`

Type: `String`  
Default: `'index.html'`

The file to write the style guide to.

## Writing documentation

To add a section of documentation, write a CSS comment that starts with three dashes `---`.

```css
/*---

This is documentation.

*/
```

```css
/*

This is not documentation

*/
```

The contents of a section of documentation are parsed by Markdown and turned into HTML.

```css
/*---

Button styles can be applied to **any** element. Typically you'll want to use
either a `<button>` or an `<a>` element:

​```html
<button class="btn">Click</button>
<a class="btn" href="/some-page">Some Page</a>
​```

*/
```

```html
<p>Button styles can be applied to <strong>any</strong> element. Typically you&#39;ll want to use
either a <code>&lt;button&gt;</code> or an <code>&lt;a&gt;</code> element:</p>

<pre><code class="lang-html">&lt;button class=&quot;btn&quot;&gt;Click&lt;/button&gt;
&lt;a class=&quot;btn&quot; href=&quot;/some-page&quot;&gt;Some Page&lt;/a&gt;
</code></pre>
```

The contents of a section may also be imported from another file.

**buttons.md**:

	Button styles can be applied to **any** element. Typically you'll want to use
	either a `<button>` or an `<a>` element:

	```html
	<button class="btn">Click</button>
	<a class="btn" href="/some-page">Some Page</a>
	​```

**base.css**:

```css
/*---
title:  Buttons
import: buttons.md
---*/
```

The contents of a section may be automatically imported as well. For example, had the `import` been omitted, a sibling file of `base.buttons.md` or `base.md` would have been used (in that order of preference) if they existed.

### Details

Additional heading details are added before a second set of three dashes `---` in a section. These heading details are parsed and added to the [`documentation` object](#documentation-object).

```css
/*---
title:   Buttons
section: Base CSS
---

Button styles can be applied to **any** element.

*/
```

```json
{
	"title": "Buttons",
	"section": "Base CSS",
	"content": "<p>Button styles can be applied to <strong>any</strong> element.</p>"
}
```

## Writing themes

Creating themes requires an understanding of [creating and publishing npm packages](https://docs.npmjs.com/misc/developers).

The easiest way to create a new theme is to visit the [boilerplate theme] project page, fork and clone it, and then run `npm install`.

To create a theme from scratch; create an `index.js` like this one in a new npm package directory:

```js
module.exports = function (themeopts) {
	// initialize the theme
	// example usage:
	// 
	// require('mdcss')({
	//   theme: require('mdcss-theme-mytheme')({ /* opts */ })
	// })

	// return the theme processor
	return function (docs) {
		// do things with the documentation object
		// remember to use __dirname to target this theme directory

		// return a promise
		return new Promise(function (resolve, reject) {
			// resolve an object with an assets path and a compiled template
			resolve({
				assets:   '', // directory of files to copy
				template: '' // contents of style guide to write
			});
		});
	};
};

// this is so mdcss can check whether the plugin has already been initialized
module.exports.type = 'mdcss-theme';
```

The `exports` function is where theme options are initialized.

```js
require('mdcss')({
	theme: require('mdcss-theme-mytheme')({ /* theme options */ });
});
```

The `exports` function returns a theme processor. The theme processor is what receives the ordered list of all the parsed `documentation` objects as well as the [options](#options) originally passed into the [mdcss] plugin.

## Documentation object

Each `documentation` object may contain the following properties:

- **title**:    The title of the current section of documentation.
- **name**:     A unique, hash-safe name of the current section of documentation.
- **section**:  The proper title of a parent section.
- **content**:  The body copy of the current section of documentation.
- **parent**:   The parent section.
- **children**: An array of child sections.
- **context**:  The original [`Comment`](https://github.com/postcss/postcss/blob/master/docs/api.md#comment-node) node used to generate the current section of documentation.
- **import**:  A path to the file representing the content of the current section of documentation.

In addition to these properties, a `documentation` object includes any additional [details](#details).

```css
/*---
title:      Buttons
section:    Base CSS
yakkityyak: Don’t Talk Back
---

Button styles can be applied to **any** element.

*/
```

---

Have fun, and thanks for using [mdcss].

[ci]:      https://travis-ci.org/jonathantneal/mdcss
[ci-img]:  https://img.shields.io/travis/jonathantneal/mdcss.svg
[npm]:     https://www.npmjs.com/package/mdcss
[npm-img]: https://img.shields.io/npm/v/mdcss.svg

[boilerplate theme]: https://github.com/jonathantneal/mdcss-theme

[Gulp PostCSS]:  https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]:       https://github.com/postcss/postcss
[mdcss]:         https://github.com/jonathantneal/mdcss
