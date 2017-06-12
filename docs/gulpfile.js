var destination = process.env.GULP_DESTINATION || 'static';

// Load plugins
var gulp = require('gulp'),
  sass = require('gulp-ruby-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  livereload = require('gulp-livereload'),
  del = require('del');
  streamqueue = require('streamqueue');
  cssnano = require('gulp-cssnano');
  sourcemaps = require('gulp-sourcemaps');
  git = require('gulp-git');
  gutil = require('gulp-util');


// Copy
gulp.task('copy', function () {
  return gulp.src('themes/helmdocs/static/src/fonts/*')
    .pipe(gulp.dest(destination + '/src/fonts'))
    .pipe(notify({message: 'Fonts moved.'}));
});
gulp.task('copyall', function () {
  return gulp.src('static/src/**/*')
    .pipe(gulp.dest('app/src'))
    .pipe(notify({message: 'Copied all.'}));
});


// Styles
gulp.task('styles', function () {
  return sass('themes/helmdocs/static/src/sass/styles.scss', {style: 'compressed'})
    .pipe(autoprefixer('last 2 version'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(sourcemaps.init())
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destination + '/src/css'))
    .pipe(notify({message: 'Styles compiled.'}));
});

// Scripts
gulp.task('scriptconcat', function () {
  return gulp.src([
      'themes/helmdocs/static/src/js/custom/jquery.js',
      'themes/helmdocs/static/src/js/custom/foundation.js',
      'themes/helmdocs/static/src/js/custom/foundation.topbar.js',
      'themes/helmdocs/static/src/js/custom/foundation.offcanvas.js',
      'themes/helmdocs/static/src/js/custom/foundation.accordion.js',
      'themes/helmdocs/static/src/js/custom/foundation.dropdown.js',
      'themes/helmdocs/static/src/js/custom/foundation.slider.js',
      'themes/helmdocs/static/src/js/custom/foundation.tooltip.js',
      'themes/helmdocs/static/src/js/custom/headroom.min.js',
    ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('themes/helmdocs/static/src/js'))
    .pipe(notify({message: 'Scripts concated.'}));
});
gulp.task('scriptminify', function () {
  return gulp.src([
      'themes/helmdocs/static/src/js/main.js',
      'themes/helmdocs/static/src/js/custom/app_init.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    // .pipe(concat())
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(destination + '/src/js'))
    .pipe(notify({message: 'Scripts minified.'}));
});
gulp.task('scripts', function () {
  gulp.start('scriptconcat', 'scriptminify');
});

// Images
gulp.task('images', function () {
  return streamqueue({objectMode: true},
    gulp.src('themes/helmdocs/static/src/img/**/*{.jpg, .png, .gif}')
      .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
      .pipe(notify({message: 'Images minifed.'})),
    gulp.src('themes/helmdocs/static/src/img/**/*')
      .pipe(notify({message: 'Images moved.'}))
      .pipe(gulp.dest(destination + '/src/img'))
  )
});

// Clean
gulp.task('clean', function () {
  return del(destination + '/src/**/*', {force: true});
});

// Clone Docs
gulp.task('clone', function() {
  git.clone('https://github.com/kubernetes/helm', {args: './source'}, function(err) {
    // handle err
  });
});
gulp.task('fetch', function () {
  gulp.start('clone');
});


// Default task
gulp.task('default', ['clean'], function () {
  gulp.start('fetch', 'styles', 'scripts', 'images', 'copy', 'copyall');
});

// Watch for changes
gulp.task('watch', function () {
  // Watch JS
  gulp.watch('themes/helmdocs/static/src/js/custom/init.js', ['scripts']);

  // Watch Images
  gulp.watch('themes/helmdocs/static/img/src/**/*.{png,gif,jpg}', ['images']);

  // Watch SASS
  gulp.watch('themes/helmdocs/static/src/sass/**/*.scss', ['styles']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in static/, reload on change
  gulp.watch([destination + '/**', destination + '/src/**']).on('change', livereload.changed);

});