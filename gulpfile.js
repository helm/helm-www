var destination = process.env.GULP_DESTINATION || 'static';

// Load plugins
var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  cache = require('gulp-cache'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  livereload = require('gulp-livereload'),
  del = require('del'),
  streamqueue = require('streamqueue'),
  cssnano = require('gulp-cssnano'),
  sourcemaps = require('gulp-sourcemaps'),
  git = require('gulp-git'),
  foreach = require('gulp-foreach'),
  inject = require('gulp-inject-string'),
  replace = require('gulp-replace'),
  stringreplace  = require('gulp-string-replace');

  sass.compiler = require('node-sass');


// Copy
gulp.task('copy', function () {
  return gulp.src('themes/helm/static/src/fonts/*')
    .pipe(gulp.dest(destination + '/src/fonts'))
});
gulp.task('copyall', function () {
  return gulp.src('static/src/**/*')
    .pipe(gulp.dest('app/src'))
});


// Styles
gulp.task('styles', function () {
  return gulp.src('themes/helm/static/src/sass/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(sourcemaps.init())
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destination + '/src/css'));
});


// Scripts
gulp.task('scriptconcat', function () {
  return gulp.src([
      'themes/helm/static/src/js/custom/jquery.js',
      'themes/helm/static/src/js/custom/foundation.js',
      'themes/helm/static/src/js/custom/foundation.offcanvas.js',
      'themes/helm/static/src/js/custom/foundation.accordion.js',
      'themes/helm/static/src/js/custom/foundation.dropdown.js',
      'themes/helm/static/src/js/custom/foundation.slider.js',
      'themes/helm/static/src/js/custom/foundation.tooltip.js'
    ], { allowEmpty: true })
    .pipe(concat('main.js'))
    .pipe(gulp.dest('themes/helm/static/src/js'));
});
gulp.task('scriptminify', function () {
  return gulp.src([
      'themes/helm/static/src/js/main.js',
      'themes/helm/static/src/js/custom/app_init.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    // .pipe(concat())
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(destination + '/src/js'));
});
gulp.task('scripts', gulp.series('scriptconcat', 'scriptminify'), function () {});


// Images
gulp.task('images', function () {
  return streamqueue({objectMode: true},
    gulp.src('themes/helm/static/src/img/**/*{.jpg, .png, .gif}')
      .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))),
    gulp.src('themes/helm/static/src/img/**/*')
      .pipe(gulp.dest(destination + '/src/img'))
  )
});


// Clean
gulp.task('clean', function () {
  return del([
    destination + '/src/**/*',
    'source/',
    'content/docs/*',
    '!content/docs/README.md'
  ], {force: true});
});


gulp.task('build',
  gulp.series([
    'styles',
    'scripts',
    'images',
    'copy',
    'copyall',
  ]),
  function() { }
);

// 'gulp' default task to build the site assets
gulp.task('default', gulp.task('build'), function() { });


// 'gulp watch' to watch for changes during dev
gulp.task('watch', function () {

  gulp.watch('themes/helm/static/src/js/custom/init.js', gulp.series('scripts'));

  gulp.watch('themes/helm/static/img/src/**/*.{png,gif,jpg}', gulp.series('images'));

  gulp.watch('themes/helm/static/src/sass/**/*.scss', gulp.series('styles'));

  livereload.listen();

  gulp.watch([destination + '/**', destination + '/src/**']).on('change', livereload.changed);
});
