function defaultTask(cb) {
  // place code for your default task here
  cb();
}

exports.default = defaultTask 

'use strict';

const gulp = require('gulp');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');

sass.compiler = require('node-sass');

// Logs Message
gulp.task('message', function(){
  return console.log('Gulp is running...');
});

gulp.task('default', function(){
  return console.log('Gulp is running...');
});

// Copy HTML files
gulp.task('copyHtml', function(){
  gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
});

// Minify JS
gulp.task('minify', function(){
  gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
});

// Compile sass
gulp.task('sass', function(){
  gulp.src('src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/styles'))
});

gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

// Scripts
gulp.task('scripts', function(){
  gulp.src('src/js/*.js')
    .pipe(concat())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('default', ['message', 'copyHtml', 'copyHtml', 'minify','sass', 'scripts']);