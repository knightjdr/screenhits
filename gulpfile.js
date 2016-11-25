var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var del = require('del');
var expect = require('gulp-expect-file');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

var appDirectory = 'app/';
var appSASS = [
	'layout/layout.scss',
	'404/404.scss',
	'404/close.scss',
	'404/treasure.scss',
	'home/home.scss',
	'signin/signin.scss',
	'dialogs/dialog.scss',
	'profile/profile.scss',
	'profile/project/project.scss'
];
var appJS = [
		'env.js',
		'layout/custom-scrollbar.module.js',
		'app.module.js',
		'app.config.js',
		'app.routes.js',
		'layout/collapse-expand.directive.js',
		'layout/flip.directive.js',
		'layout/md-tooltip-destroy.directive.js',
		'signin/credentials.service.js',
		'helpers/helper-compile.directive.js',
		'helpers/helper-dialog.service.js',
		'helpers/helper-http.service.js',
		'helpers/helper-object.service.js',
		'helpers/helper-report.service.js',
		'dialogs/alert/alert.controller.js',
		'404/404.controller.js',
		'profile/project/projects.service.js',
		'signin/signin-callbacks.service.js',
		'signin/signout-unload.service.js',
		'signin/signin.directive.js',
		'signin/signout.directive.js',
		'signin/signin.controller.js',
		'profile/profile.controller.js',
		'profile/project/project.controller.js',
		'profile/project/project-new.controller.js',
		'profile/project/project-management.controller.js',
		'profile/experiment/experiment-creation.controller.js',
		'profile/screen/screen-creation.controller.js'
];
var assetsDirectory = 'assets/'
var assetsCSS = [
	'angular-material.css',
	'font-awesome.css',
	'normalize.css',
	'ppvn-angular.css'
];
var assetsJS = [
	'angular.min.js',
	'angular-animate.min.js',
	'angular-aria.min.js',
	'angular-material.min.js',
	'angular-messages.min.js',
	'angular-sanitize.min.js',
	'angular-ui-router.min.js',
	'ct-ui-router-extras.min.js',
	'ppvn-angular.min.js'
];
var testJS = 'app/*/tests/*.spec.js'

//minify asset css
for(var i = 0, iLen = assetsCSS.length; i < iLen; i++) {
	assetsCSS[i] = assetsDirectory + 'css/' + assetsCSS[i];
}
gulp.task('assets-css-minify', function() {
	return gulp.src(assetsCSS)
		.pipe(expect(assetsCSS))
    .pipe(rename(function (path) {
    	path.basename += ".min";
  	}))
    .pipe(cleanCSS())
    .pipe(gulp.dest(assetsDirectory + 'css/'))
	;
});
//concat asset css
gulp.task('assets-css-concat', function() {
	return gulp.src(assetsDirectory + "css/*.min.css")
		.pipe(concat('assets.min.css'))
    .pipe(gulp.dest(assetsDirectory + 'css/'))
	;
});
//build asset css
gulp.task('build-assets-css', gulp.series('assets-css-minify', 'assets-css-concat'));

//minify and bundle app css
appCSS = [];
for(var i = 0, iLen = appSASS.length; i < iLen; i++) {
	appSASS[i] = appDirectory + appSASS[i];
	var currFile = appSASS[i].substring(0, appSASS[i].lastIndexOf('.'));
	appCSS.push(currFile + '.css');
}
gulp.task('sass-convert', function() {
	return gulp.src(appSASS, {base: "./"})
  	.pipe(sass())
    .pipe(gulp.dest("./"))
	;
});
gulp.task('css-concat', function() {
	return gulp.src(appCSS)
		.pipe(concat('bundle.css'))
    .pipe(gulp.dest(appDirectory))
	;
});
gulp.task('css-minify', function() {
	return gulp.src(appDirectory + 'bundle.css')
    .pipe(rename(function (path) {
    	path.basename += ".min";
  	}))
    .pipe(cleanCSS())
    .pipe(gulp.dest(appDirectory))
	;
});
gulp.task('del-css', function() {
	return del([appDirectory + '**/*.css', '!' + appDirectory + 'bundle.min.css']);
});
//build app css
gulp.task('build-css', gulp.series('sass-convert', 'css-concat', 'css-minify', 'del-css'));

//jshint
gulp.task('jshint', function() {
  return gulp.src(appJS)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

//bundle asset javascript
for(var i = 0, iLen = assetsJS.length; i < iLen; i++) {
	assetsJS[i] = assetsDirectory + 'js/' + assetsJS[i];
}
gulp.task('assets-js-bundle', function() {
	return gulp.src(assetsJS)
		.pipe(expect(assetsJS))
		.pipe(concat('assets.min.js'))
    .pipe(gulp.dest(assetsDirectory + 'js/'))
	;
});

//minify and bundle app javascript
for(var i = 0, iLen = appJS.length; i < iLen; i++) {
	appJS[i] = appDirectory + appJS[i];
}
gulp.task('js-minify', gulp.series('jshint', function() {
	return gulp.src(appJS)
		.pipe(concat('bundle.js'))
    .pipe(gulp.dest(appDirectory))
    .pipe(rename('bundle.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(appDirectory))
	;
}));

//check test JS
gulp.task('test-jshint', function() {
  return gulp.src(testJS)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('dev', function() {
	nodemon({
  	script: 'server/index.js',
    watch: ["server/index.js", "server/config.js", "server/app/"],
    ext: 'js'
   }).on('restart', function() {
   	gulp.src('server/index.js')
  });
	gulp.watch(appSASS, gulp.parallel('build-css'));
	gulp.watch(appJS, gulp.parallel('js-minify'));
	gulp.watch(testJS, gulp.parallel('test-jshint'));
});

gulp.task('build', function() {
});
