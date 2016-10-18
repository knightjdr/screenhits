var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var expect = require('gulp-expect-file');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var appDirectory = 'app/';
var assetsDiretory = 'assets/'
var assetsCSS = [
	'font-awesome.css',
	'normalize.css',
	'demo.css',
	'ppvn-angular.css',
	'angular-material.css'
];
var assetsJS = [
	'angular.min.js',
	'angular-animate.min.js',
	'angular-aria.min.js',
	'angular-material.min.js',
	'ppvn-angular.min.js'
];
var assetsBodyJs = [
	'classie.js',
	'menu.js'
];
var bundleJS = [
		'app.module.js'
];

//minify asset css
for(var i = 0, iLen = assetsCSS.length; i < iLen; i++) {
	assetsCSS[i] = assetsDiretory + 'css/' + assetsCSS[i];
}
gulp.task('assets-css-minify', function() {
	return gulp.src(assetsCSS)
		.pipe(expect(assetsCSS))
    .pipe(rename(function (path) {
    	path.basename += ".min";
  	}))
    .pipe(cleanCSS())
    .pipe(gulp.dest(assetsDiretory + 'css/'))
	;
});
//concat asset css
gulp.task('assets-css-concat', ['assets-css-minify'], function() {
	return gulp.src(assetsDiretory + "css/*.min.css")
		.pipe(concat('assets.min.css'))
    .pipe(gulp.dest(assetsDiretory + 'css/'))
	;
});
//build asset css
gulp.task('build-assets-css', ['assets-css-minify', 'assets-css-concat']);

gulp.task('jshint', function() {
  return gulp.src(jsSource)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

//bundle asset javascript
for(var i = 0, iLen = assetsJS.length; i < iLen; i++) {
	assetsJS[i] = assetsDiretory + 'js/' + assetsJS[i];
}
gulp.task('assets-js-bundle', function() {
	return gulp.src(assetsJS)
		.pipe(expect(assetsJS))
		.pipe(concat('assets.min.js'))
    .pipe(gulp.dest(assetsDiretory + 'js/'))
	;
});

//minify body asset javascript
for(var i = 0, iLen = assetsBodyJs.length; i < iLen; i++) {
	assetsBodyJs[i] = assetsDiretory + 'js/' + assetsBodyJs[i];
}
gulp.task('assets-body-js', function() {
	return gulp.src(assetsBodyJs)
		.pipe(expect(assetsBodyJs))
		.pipe(concat('assets.body.js'))
    .pipe(gulp.dest(assetsDiretory + 'js/'))
	;
});

//minify and bundle app javascript
for(var i = 0, iLen = bundleJS.length; i < iLen; i++) {
	bundleJS[i] = appDirectory + bundleJS[i];
}
gulp.task('js-minify', function() {
	return gulp.src(bundleJS)
		.pipe(concat('bundle.js'))
    .pipe(gulp.dest(appDirectory))
    .pipe(rename('bundle.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(appDirectory))
	;
});

gulp.task('build', function() {
});
