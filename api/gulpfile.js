const gulp = require('gulp');
const jshint = require('gulp-jshint');
const nodemon = require('gulp-nodemon');

const modules = {
  node: { src: './**/*.js' },
};

gulp.task('js-hint', () => {
  return gulp.src(modules.node.src)
    .pipe(jshint({ esversion: 6, node: true }))
    .pipe(jshint.reporter('jshint-stylish'))
  ;
});

gulp.task('node-watch', () => {
  gulp.watch(modules.node.src, ['js-hint']);
});


gulp.task('dev', () => {
  nodemon({
    script: './index.js',
    watch: modules.node.src,
  }).on('restart', () => {
    console.log('restarted');
    // gulp.src('./index.js');
  });
});
