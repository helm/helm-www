/*!
 * gulp
 * $ npm install del gulp gulp-ruby-sass gulp-autoprefixer gulp-cache gulp-cssnano gulp-imagemin gulp-livereload gulp-minify-css gulp-notify gulp-rename gulp-sourcemaps streamqueue --save-dev
*/

// Load plugins
var gulp = require('gulp'),
  del = require('del');
  sass = require('gulp-ruby-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cache = require('gulp-cache'),
  cssnano = require('gulp-cssnano'),
  imagemin = require('gulp-imagemin'),
  livereload = require('gulp-livereload'),
  notify = require('gulp-notify'),
  rename = require('gulp-rename'),
  sourcemaps = require('gulp-sourcemaps'),
  streamqueue = require('streamqueue')

// Styles
gulp.task('styles', function () {
  return sass('assets/scss/app.scss', {style: 'expanded'})
    .pipe(autoprefixer('last 2 version'))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.init())
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest( 'assets/css'))
    .pipe(gulp.dest( '_site/assets/css'))
    .pipe(notify({message: 'Styles task complete'}))
});


// Images
gulp.task('images', function () {
  return streamqueue({objectMode: true},
    gulp.src('assets/images/**/*{.jpg,.png,.gif}')
      .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
      // .pipe(notify({message: 'Image minifed'}))
      .pipe(gulp.dest('assets/images/'))
      .pipe(gulp.dest('_site/assets/images/'))
  )
});


// Default task
gulp.task('default', function () {
  gulp.start('styles', 'images');
});


// Watch task
gulp.task('watch', function () {

  // Watch .scss files
  gulp.watch('assets/scss/**/*.scss', ['styles']);

  // Watch image files
  gulp.watch('images/**/*.{png,gif,jpg}', ['images']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in _site, reload on change
  gulp.watch(['_site/assets/**/*']).on('change', livereload.changed);

});