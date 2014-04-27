var gulp = require('gulp');

var paths = {
  markup: 'src/index.html',
  scriptsRoot: 'src/js/',
  scripts: 'src/js/**/*.js',
  assets: ['src/assets/*.png', 'src/assets/*.jpg'],
  css: 'src/css/*.css',
  dist: 'dist',
  docsOutput: 'dist/docs',
  mainjs: './src/js/main.js',
  bundlejs: 'bundle.js'
};

gulp.task('build', ['lint-js', 'build-js', 'build-markup', 'build-assets', 'build-css', 'build-docs']);

gulp.task('lint-js', function () {
  var jshint = require('gulp-jshint');
  var stylish = require('jshint-stylish');

  gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('beautify', function () {
  var beautify = require('gulp-beautify');

  gulp.src(paths.scripts)
    .pipe(beautify())
    .pipe(gulp.dest(paths.scriptsRoot));
});

gulp.task('build-js', function () {
  var browserify = require('browserify');
  var source = require('vinyl-source-stream');
  var streamify = require('gulp-streamify');
  var uglify = require('gulp-uglify');

  var bundleStream = browserify(paths.mainjs).bundle();

  bundleStream
    .pipe(source(paths.bundlejs))
  //.pipe(streamify(uglify()))
  .pipe(gulp.dest(paths.dist + '/js'));
});

gulp.task('build-markup', function () {
  return gulp.src(paths.markup)
    .pipe(gulp.dest(paths.dist));
});

gulp.task('build-assets', function () {
  var imagemin = require('gulp-imagemin');
  return gulp.src(paths.assets)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist + '/assets'));
});

gulp.task('build-css', function () {
  return gulp.src(paths.css)
    .pipe(gulp.dest(paths.dist + '/css'));
});



gulp.task('static-server', function (next) {
  var connect = require('connect');
  var server = connect();
  server.use(connect.static(paths.dist)).listen(process.env.PORT || 3002, next);
});

gulp.task('watch', ['build', 'trigger-reload', 'build-markup-with-livereload', 'static-server'], function () {
  gulp.watch(paths.scripts, ['lint-js', 'build-js']);
  gulp.watch(paths.markup, ['build-markup-with-livereload']);
  gulp.watch(paths.assets, ['build-assets']);
  gulp.watch(paths.css, ['build-css']);
  gulp.watch(paths.scripts, ['build-docs']);
});

gulp.task('trigger-reload', function () {
  var livereload = require('gulp-livereload');
  var server = livereload();
  gulp.watch(paths.dist + '/**').on('change', function (file) {
    server.changed(file.path);
  });
});

gulp.task('build-markup-with-livereload', function () {
  var embedlr = require("gulp-embedlr");
  gulp.src(paths.markup)
    .pipe(embedlr())
    .pipe(gulp.dest(paths.dist));
});

// help task -- list all available tasks
gulp.task('help', require('gulp-task-listing'));


// help task -- list all available tasks
gulp.task('build-docs', function () {
  // var docco = require('gulp-docco');
  var Docker = require('docker');

  var d = new Docker({
    inDir: '.',
    outDir: 'dist/docs',
    colourScheme: 'monokai',
    ignoreHidden: 'true',
    exclude: './node_modules/**'
  });


  d.doc(['./']);



});


// default task
gulp.task('default', ['watch']);