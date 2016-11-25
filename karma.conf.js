// Karma configuration
// Generated on Wed Oct 26 2016 12:34:38 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon'],


    // list of files / patterns to load in the browser
    files: [
      'assets/js/assets.min.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/element-closest/element-closest.js',
      'node_modules/promise-polyfill/promise.js',
      'app/env.js',
      'app/layout/custom-scrollbar.module.js',
      'app/app.module.js',
      'app/app.config.js',
      'app/app.routes.js',
      'app/layout/collapse-expand.directive.js',
  		'app/layout/flip.directive.js',
  		'app/layout/md-tooltip-destroy.directive.js',
      'app/signin/credentials.service.js',
      'app/helpers/helper-compile.directive.js',
      'app/helpers/helper-dialog.service.js',
  		'app/helpers/helper-http.service.js',
      'app/helpers/helper-object.service.js',
      'app/helpers/helper-report.service.js',
      'app/dialogs/alert/alert.controller.js',
  		'app/404/404.controller.js',
      'app/profile/project/projects.service.js',
  		'app/signin/signin-callbacks.service.js',
  		'app/signin/signout-unload.service.js',
  		'app/signin/signin.directive.js',
  		'app/signin/signout.directive.js',
  		'app/signin/signin.controller.js',
  		'app/profile/profile.controller.js',
      'app/**/tests/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
