# mdcss

<img align="right" width="96" height="96" src="https://i.imgur.com/3rqeZXi.png" title="logo of mdcss">

[![NPM Version][npm-img]][npm] [![Build Status][ci-img]][ci]

[mdcss] lets you easily create and maintain style guides with CSS comments using Markdown.

```css
/*---
title:   Buttons
section: Base CSS
---

Button styles can be applied to any element. Typically you'll want to use
either a `<button>` or an `<a>` element:

​```html_example
<button class="btn">Click</button>
<a class="btn" href="/some-page">Trulia!</a>
​```
*/

.btn {
	background-color: black;
	color: white;
}
```

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

The theme to be used by [mdcss] to create the style guide.

```js
require('mdcss')({
	theme: require('mdcss-theme-github')
})
```

#### `destination`

Type: `String`  
Default: `'styleguide'`

The directory to write the style guide to.

## Writing documentation

Add a section of documentation by writing a CSS comment that starts with three dashes `---`.

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

The content of documentation will be parsed by Markdown and turned into HTML.

```css
/*---

Button styles can be applied to **any** element. Typically you'll want to use
either a `<button>` or an `<a>` element:

​```html
<button class="btn">Click</button>
<a class="btn" href="/some-page">Trulia!</a>
​```

*/
```

```html
<p>Button styles can be applied to <strong>any</strong> element. Typically you&#39;ll want to use
either a <code>&lt;button&gt;</code> or an <code>&lt;a&gt;</code> element:</p>

<pre><code class="lang-html">&lt;button class=&quot;btn&quot;&gt;Click&lt;/button&gt;
&lt;a class=&quot;btn&quot; href=&quot;/some-page&quot;&gt;Trulia!&lt;/a&gt;
</code></pre>
```

Add details before a second set of three dashes `---` to establish a heading for a section. Details consist of a word followed by a colon and then some text. Details are added to the `Documentation` object which is passed to the theme.

```css
/*---
title:   Buttons
section: Base CSS
---

Button styles can be applied to **any** element.

*/
```

## Anatomy of `Documentation`

Each `Documentation` object contains information about itself as well its relationship to other sections and the CSS itself.

- **title**:    The proper title of the current section.
- **name**:     The unique, hash-safe name of the current section.
- **section**:  The proper title of the parent of the current section.
- **content**:  The body of the current section.
- **context**:  The original [`Comment`](https://github.com/postcss/postcss/blob/master/docs/api.md#comment-node) node used to generate the current section.
- **parent**:   The `Documentation` parent of the current section, if there is one.
- **children**: An array of child `Documentation` sections.

And remember, the `Documentation` object includes any and all details added to the heading.

```css
/*---
title:      Buttons
section:    Base CSS
yakkityyak: Don’t Talk Back
---

Button styles can be applied to **any** element.

*/
```

## Writing themes

Developing themes requires a basic understanding of [creating and publishing npm packages](https://docs.npmjs.com/misc/developers).

### Forking the boilerplate theme

The boilerplate theme makes it easy to create new themes. Visit the [boilerplate theme] project page, fork the project, and follow the instructions. They really are as simple as running `npm install`.

To learn more about themes, continue reading.

### Creating a new theme

To get started; in a new npm package directory, create an `index.js` file that exports a function.

```js
module.exports = function (opts) {
	// initialize the theme
	// example usage:
	// 
	// require('mdcss')({
	//   theme: require('mdcss-theme-mytheme')({ /* opts */ })
	// })

	return function (documentation, destination, result) {
		// do things with the documentation and destination path
		// remember to use __dirname to target the theme directory

		return new Promise(function (resolve, reject) {
			// the theme may return a promise to more accurately resolve mdcss
		});
	};
};

// this is so mdcss can check whether the plugin has already been initialized
module.exports.type = 'mdcss-theme';
```

The exports function is where any theme options should be initialized. It should be executed when [mdcss] is executed.

```js
require('mdcss')({
	theme: require('mdcss-theme-mytheme')({ /* theme options */ });
});
```

The exports function will then return a processor function, which is the heart of a theme. The processor function will receive 3 parameters — `documentation`, the [Documentation](#anatomy-of-documentation) object; `destination`, the [directory](#destination) to write the style guide to; and `result`, the [Result](https://github.com/postcss/postcss/blob/master/docs/api.md#result-class) instance from PostCSS.

The `documentation` object contains all parsed documentation with references to the original source code, making it easy to put together many different styles of documentation.

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
