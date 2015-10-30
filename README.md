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
require('mdcss')({ /* options */ }).process(YOUR_CSS);
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

The mdcss theme that you would like to use.

#### `destination`

Type: `String`  
Default: `'styleguide'`

The directory that you would like your style guide written to.

[ci]:      https://travis-ci.org/jonathantneal/mdcss
[ci-img]:  https://img.shields.io/travis/jonathantneal/mdcss.svg
[npm]:     https://www.npmjs.com/package/mdcss
[npm-img]: https://img.shields.io/npm/v/mdcss.svg

[Gulp PostCSS]:  https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]:       https://github.com/postcss/postcss
[mdcss]:  https://github.com/jonathantneal/mdcss
