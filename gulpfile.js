/*
This file is used by the `gulp` module in order to perform build-related tasks.

Note that with gulp, each subtask is run asynchronously. This means they will
run *at the same time*, thus saving time. There are additional hoops to jump though to make them synchronous.

See [Gulp](http://gulpjs.com) for more details.

Also notice that `require` statements are called within each gulp task instead of all at the top of the file.
This is done so only modules that are used are loaded when gulp is run, which means "lighter" tasks will execute a few
hundred milliseconds faster as they aren't loading unused modules.

For example, when running `gulp help`, we don't need to load all the other heavy modules such
as `docker` and `browserify` just to display the help task.

*/

// require the `gulp` module. Pretty important of this file! :)
var gulp = require('gulp');

// Here is a plain JS object to hold the file paths in one place.
// This is done to make things a bit easier to manage if we change them later.
var paths = {
  gulpfile: 'gulpfile.js',
  readme: 'README.md',
  markup: 'src/**/*.html',
  scriptsRoot: 'src/js/',
  scripts: 'src/js/**/*.js',
  assets: ['src/assets/*.png', 'src/assets/*.jpg','src/assets/*.json'],
  css: 'src/css/*.css',
  dist: 'dist',
  docsOutput: 'dist/docs',
  docsExclude: 'node_modules*,dist*',
  mainjs: './src/js/main.js',
  bundlejs: 'bundle.js'
};


/*
## build

This is the main task to build the project. Each build step is separted into a subtask
to make things a bit easier to follow.
 */
gulp.task('build', ['lint-js', 'build-js', 'build-markup', 'build-assets', 'build-css', 'build-docs']);

/*
### lint-js
A subtask called by the build task to "lint" all JavaScript files. If any files have
linting issues (bad syntax, poor formatting, etc), they will show up in the console. The rules are controlled by
the `.jshintrc` file. See the [jshint.com](http://www.jshint.com/) site for more details.
 */
gulp.task('lint-js', function () {
  var jshint = require('gulp-jshint');
  var stylish = require('jshint-stylish');

  gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

/*
### build-js

This subtask will prepare all JS files for output. This is done
by running all files through `browserify`. This will prepare the
files to be used by the front-end and concatenate them into a single
`bundle.js` file, which is the file included on [index.html](src/index.html.html)

Note that `uglify` step could be done here as well.
 */
gulp.task('build-js', function () {
  var browserify = require('browserify');
  var source = require('vinyl-source-stream');
  // uglify steps are commented out for now...
  // ```
  // var streamify = require('gulp-streamify');
  // var uglify = require('gulp-uglify');
  // ```

  var bundleStream = browserify(paths.mainjs).bundle();

  bundleStream
    .pipe(source(paths.bundlejs))
  // ```
  //.pipe(streamify(uglify()))
  // ```
  .pipe(gulp.dest(paths.dist + '/js'));
});


/*
### build-markup

Simple task to copy the index.html file into the `dist` directory.
 */
gulp.task('build-markup', function () {
  return gulp.src(paths.markup)
    .pipe(gulp.dest(paths.dist));
});


/*
### build-assets

Another `build` subtask that will take all the images from the `assets` directory
and run them through `imagemin` to compress down the images. These minified
assets are dropped into the `dist` directory.
 */
gulp.task('build-assets', function () {
  var imagemin = require('gulp-imagemin');
  return gulp.src(paths.assets)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist + '/assets'));
});


/*
### build-css

A simple task to copy css files directly over to the `dist` directory. Its called as a subtask to the `build` task.
This task could be modified to do some fancy-pantsy css related things if thats your thing.
 */
gulp.task('build-css', function () {
  return gulp.src(paths.css)
    .pipe(gulp.dest(paths.dist + '/css'));
});

/*
### build-docs

This task will generate the HTML documentation web pages using [docker.js](http://jbt.github.io/docker/src/docker.js.html).

All documentation is extracted from comments directly in each JS file.

To reduce the time it takes to build, it will only rebuild the files
that changed each time its run. To force all files to be rebuild, run `gulp clean`
before this task.

 */
gulp.task('build-docs', function () {
  var Docker = require('docker');

  var d = new Docker({
    inDir: '.',
    outDir: paths.docsOutput,
    colourScheme: 'monokai',
    ignoreHidden: 'true',
    exclude: paths.docsExclude,
    lineNums: true,
    extras: ['fileSearch', 'goToLine'],
    onlyUpdated: true
  });

  return d.doc(['./']);

});


/*
## watch
This task is used for development. Running `gulp watch` does the following:

    * trigger a fresh build of the whole project
    * start up a web server at `http://localhost:3002` that serves the built files.
    * begin "watching" the soruce files. Changing a file triggers a rebuild of the project
    * This also sends a message to the browser via `livereload` to refresh the page automatically.

This is a powerful little task that should help make it easy to test code quickly without having to kick off builds all the time.
However, if a file is saved with a syntax error, it will kill the task. Just restart the task to continue.


  This task will watch everything except `dist` and `node_modules` for documentation updates.

 */
gulp.task('watch', ['build', 'trigger-reload', 'build-markup-with-livereload', 'static-server'], function () {

  gulp.watch(paths.scripts, ['lint-js', 'build-js']);
  gulp.watch(paths.markup, ['build-markup-with-livereload']);
  gulp.watch(paths.assets, ['build-assets']);
  gulp.watch(paths.css, ['build-css']);

  gulp.watch([paths.markup, paths.scripts, paths.readme, paths.gulpfile], ['build-docs']);
});

/*
### static-server

This task will start a new `connect` web server with the root pointed at the `dist` directory.
This is used by the `watch` task, but it can also be called directly.

By default the port used is http://localhost:3002, however you can override this
by setting the environmental variable "PORT" before running `gulp`.

 */
gulp.task('static-server', function (next) {
  var connect = require('connect');
  var server = connect();
  server.use(connect.static(paths.dist)).listen(process.env.PORT || 3002, next);
});

/*
### trigger-reload

This task will watch for any files to change in the `dist` directory
and trigger a livereload to happen.This should only be called as a subtask to` watch`.

 */
gulp.task('trigger-reload', function () {
  var livereload = require('gulp-livereload');
  var server = livereload();
  gulp.watch(paths.dist + '/**').on('change', function (file) {
    server.changed(file.path);
  });
});


/*
### build-markup-with-livereload

This task will inject the necessary `<script>` tag into `index.html` in order to enable live
reload via `watch`. This task should only need to be invoked as a
dependency to the `watch` task.

 */
gulp.task('build-markup-with-livereload', function () {
  var embedlr = require("gulp-embedlr");
  gulp.src(paths.markup)
    .pipe(embedlr())
    .pipe(gulp.dest(paths.dist));
});

/*
  ## help

  List all available tasks. This directly uses the `gulp-task-listing` module
  to accomplish this. By default any tasks with a dash in the name is considered a
  "sub task" and will not be listed.

 */
gulp.task('help', require('gulp-task-listing'));


/*
## clean

Removes the `dist` directory and all build output.

 */
gulp.task('clean', function (cb) {
  var rimraf = require('rimraf');
  return rimraf('./dist', cb);
});

/*
## beautify

This task will "beautify" the soruce JS files by formatting them
according to the `.jsbeautifyrc` file. Note that this task is must
be run manually (it is not part of the `build` task).
 */
gulp.task('beautify', function () {
  var beautify = require('gulp-beautify');

  gulp.src(paths.scripts)
    .pipe(beautify())
    .pipe(gulp.dest(paths.scriptsRoot));
});

/*
  ## defaut

  The default task is `watch`

 */
gulp.task('default', ['watch']);