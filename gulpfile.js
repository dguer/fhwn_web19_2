"use strict";

const { src, dest, parallel, series, watch } = require('gulp');
const concat = require('gulp-concat');
const htmlhint = require("gulp-htmlhint");

const sass = require('gulp-sass');
sass.compiler = require('node-sass');

var uncomment = require('gulp-uncomment');
var favicons = require('gulp-favicons');

const debug = require('gulp-debug');

var deploy = require('gulp-gh-pages');

gulp.task('deploy', function () {
  return gulp.src("./prod/**/*")
    .pipe(deploy({ 
      remoteUrl: "https://dguer.github.io/fhwn_web19_2/",
      branch: "master"
    }))
});

function html() {
  return src('src/*.html')
	.pipe(debug({title: 'html:'}))
	.pipe(htmlhint())
	.pipe(htmlhint.failOnError())
	.pipe(dest('dist'));
}


async function css() {
  return src('src//sass/*.scss')
	.pipe(debug({title: 'css :'}))
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('dist/css'));
}

async function js() {
  return src('src/js/*.js', { sourcemaps: true })
	.pipe(debug({title: 'js  :'}))
    .pipe(concat('code.js'))
	.pipe(uncomment({
            removeEmptyLines: true
        }))
    .pipe(dest('dist/js', { sourcemaps: true }));
}

function ico() {
    return src('src/*.ico')
      .pipe(dest('dist'));
  }

exports.js = js;
exports.css = css;
exports.html = series(html);
exports.default = parallel(html, css, js, ico);
