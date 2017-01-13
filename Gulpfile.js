/// <binding Clean='floating' />
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
gulp.task('sassSampleFloating', function () {
    gulp.src('sass/floating.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./Content'));
});
gulp.task('autoPrefixFloating', function () {
    return gulp.src('sass/floating.scss')
		.pipe(autoprefixer({
		    browsers: ['last 2 versions'],
		    cascade: false
		}))
		.pipe(gulp.dest('./Content'));
});
var concatCss = require('gulp-concat-css');
gulp.task('concatFloating', function () {
    return gulp.src('Content/**/floating.css')
      .pipe(concatCss("floating.min.css"))
      .pipe(gulp.dest('Content/'));
});
var concat = require('gulp-concat');
gulp.task('jsmuepCtrl', function () {
    return gulp.src('./Controllers/muepCtrl.js')
      .pipe(concat('muepCtrl.min.js'))
      .pipe(gulp.dest('./Controllers'));
});
gulp.task('jsmuepStartCtrl', function () {
    return gulp.src('./Controllers/muepStartCtrl.js')
      .pipe(concat('muepStartCtrl.min.js'))
      .pipe(gulp.dest('./Controllers'));
});
