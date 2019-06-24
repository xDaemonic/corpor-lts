var gulp = require('gulp');
var bs = require('browser-sync');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');
var autoprefixer = require('gulp-autoprefixer');
var concatCss = require('gulp-concat-css');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');


// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function () {

	bs.init({
		server: "./"
	});

	gulp.watch("src/sass/*.sass", ['sass']);
	gulp.watch("src/*.html").on('change', bs.reload);
	gulp.watch("src/*.php").on('change', bs.reload);
	gulp.watch("src/js/*.js").on('change', bs.reload);

});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
	return gulp.src("src/sass/*.sass")
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 10 versions'],
			cascade: false
		}))
		.pipe(concatCss("main.css"))
		.pipe(gulp.dest("src/css"))
		.pipe(bs.stream());
});

gulp.task('default', ['serve']);

gulp.task('dist', function () {
	return gulp.src('./src/**')
		.pipe(gulp.dest('dist'));
});


gulp.task('compress', ['dist'], function (cb) {
	return gulp.src('dist/**/*.js')
		.pipe(uglify().on('error', function (e) {
			console.log(e);
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('minify-css', ['compress'], function () {
	return gulp.src('dist/**/*.css')
		.pipe(cleanCSS({
			compatibility: 'ie8'
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('minify', ['minify-css'], function () {
	return gulp.src('.dist/*.html')
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(gulp.dest('dist'));
});