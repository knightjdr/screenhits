const gulp = require('gulp');
const jshint = require('gulp-jshint');
const nodemon = require('gulp-nodemon');

const src = './**/*.js';

gulp.task('js-hint', () => {
  return gulp.src(src)
    .pipe(jshint({ esversion: 6, node: true }))
    .pipe(jshint.reporter('jshint-stylish'))
  ;
});

gulp.task('lint', () => {
  gulp.src(src)
    .pipe(jshint())
  ;
});

gulp.task('dev', () => {
  const stream = nodemon({
    env: {
      NODE_ENV: 'development',
    },
    ext: 'js',
    tasks: ['lint'],
  });
  stream
    .on('restart', () => {
      console.log('restarted');
    })
  ;
});
