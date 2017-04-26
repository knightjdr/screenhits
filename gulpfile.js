const gulp = require('gulp');
const jshint = require('gulp-jshint');
const nodemon = require('gulp-nodemon');
const util = require('gulp-util');

const modules = {
    node: {src: 'api/**/*.js'},
};

gulp.task('js-hint', function() {
  const module = modules[util.env.module];
  return gulp.src(module.src)
    .pipe(jshint({esversion: 6, node: true}))
    .pipe(jshint.reporter('jshint-stylish'))
  ;
});

gulp.task('dev', function() {
  nodemon({
    script: 'api/index.js',
    watch: modules.node.src
	}).on('restart', function() {
   	gulp.src('api/index.js')
  });
	gulp.watch(modules.node.src, ['js-hint'])
    .on('change', function () {
      util.env.module = 'node';
    })
  ;
});
