const gulp = require('gulp');
const fs = require('fs');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const concat = require('gulp-concat');

// Logs Message
gulp.task('message', function () {
    return console.log('Gulp is running...');
});

// Copy HTML files
gulp.task('copyHtml', function () {
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
});

// Minify JS
gulp.task('minify', async function () {
    gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

// Compile sass
gulp.task('sass', async function () {
    gulp.src('src/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/styles'))
});

// Scripts
gulp.task('scripts', async function () {
    gulp.src('src/js/*.js')
        .pipe(concat())
        .pipe(gulp.dest('dist/js'));
});


async function asyncAwaitTask() {
    const { version } = fs.readFileSync('package.json');
    console.log(version);
    await Promise.resolve('some result');
}

exports.default = asyncAwaitTask;

gulp.task('default', ['message', 'copyHtml', 'minify', 'sass', 'scripts']);