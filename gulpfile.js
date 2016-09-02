/*!
 * gulp
 * $ npm install del gulp gulp-autoprefixer gulp-cache gulp-concat gulp-cssnano gulp-imagemin gulp-jshint gulp-connect gulp-livereload gulp-minify-css gulp-notify gulp-rename gulp-ruby-sass gulp-sourcemaps gulp-uglify gulp-uncss streamqueue critical gulp-inline-css --save-dev
*/

// Load plugins
var gulp = require('gulp'),
  del = require('del');
  sass = require('gulp-ruby-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  livereload = require('gulp-livereload'),
  cssnano = require('gulp-cssnano'),
  sourcemaps = require('gulp-sourcemaps'),
  uncss = require('gulp-uncss'),
  streamqueue = require('streamqueue'),
  critical = require('critical'),
  inlineCss = require('gulp-inline-css');


// Styles
gulp.task('styles', function () {
  return sass('assets/scss/app.scss', {style: 'expanded'})
    .pipe(autoprefixer('last 2 version'))
    // .pipe(uncss({
    //   html: [
    //     'http://localhost:4000/',
    //     'http://localhost:4000/404',
    //     'http://localhost:4000/about',
    //     'http://localhost:4000/blog',
    //     'http://localhost:4000/blog/2016/docker-storage-introduction/',
    //     'http://localhost:4000/blog/2016/deis-workflow-2-2/',
    //     'http://localhost:4000/careers',
    //     'http://localhost:4000/community',
    //     'http://localhost:4000/docs',
    //     'http://localhost:4000/phippy',
    //     'http://localhost:4000/services',
    //     'http://localhost:4000/thanks',
    //     'http://localhost:4000/workflow',
    //     'http://localhost:4000/workflow/how-it-works'
    //   ],
    //   ignore: [
    //     /\^.headroom/,
    //     /headroom/,
    //     /navbar/,
    //     /blog-nav/,
    //     /dropdown/,
    //     /f-dropdown/,
    //     /f-open-dropdown/,
    //     /post__sidebar/,
    //     /subscribe/,
    //     /dropdown/,
    //     /social-links/,
    //     /open/,
    //     /hover/,
    //     /active/,
    //     /^meta/,
    //     /^.is/
    //   ]
    // }))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(sourcemaps.init())
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest( 'assets/css'))
    .pipe(gulp.dest( '_site/assets/css'))
    .pipe(notify({message: 'Styles task complete'}))
  // gulp.start('inline')
  // .pipe(notify({message: 'Styles inlined'}))
});


// Inline Critical CSS
gulp.task('inline', function (cb) {
  critical.generate({
    base: '_site/',
    src: 'index.html',
    css: ['assets/css/app.min.css'],
    dimensions: [{
      width: 320,
      height: 480
    },{
      width: 768,
      height: 1024
    },{
      width: 1280,
      height: 960
    }],
    dest: '_includes/critical.min.css',
    minify: true,
    extract: false,
    ignore: ['font-face']
  })
});


// Scripts
gulp.task('scriptcustom', function () {
  return gulp.src([
      // 'bower_components/jquery/dist/jquery.min.js',
        // jQuery is bundled with mc-validate.js
      'bower_components/foundation/js/foundation/foundation.js',
      'bower_components/foundation/js/foundation/foundation.dropdown.js',
      'bower_components/foundation/js/foundation/foundation.offcanvas.js',
      'assets/js/vendor/headroom.min.js'
    ])
    .pipe(concat('custom.js'))
    .pipe(gulp.dest('assets/js/custom/'))
    .pipe(notify({message: 'Script custom concat complete'}));
});
gulp.task('scriptanalytics', function () {
  return gulp.src([
      'assets/js/custom/ga.js',
      'assets/js/vendor/autotrack.js'
    ])
    .pipe(concat('analytics.js'))
    .pipe(gulp.dest('assets/js/custom/'))
    .pipe(gulp.dest('_site/assets/js/custom/'))
    .pipe(notify({message: 'Script analytics concat complete'}));
});
gulp.task('scriptminify', function () {
  return gulp.src([
      'assets/js/vendor/mc-validate.js',
      'assets/js/custom/custom.js',
      'assets/js/custom/init.js',
      'assets/js/custom/analytics.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    // .pipe(concat())
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js/dist/'))
    .pipe(gulp.dest('_site/assets/js/dist/'))
    .pipe(notify({message: 'Script minify complete'}));
});
gulp.task('scripts', function () {
  gulp.start('scriptcustom', 'scriptanalytics', 'scriptminify');
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
  gulp.start('styles', 'scripts', 'images');
});


// Watch task
gulp.task('watch', function () {

  // Watch .scss files
  gulp.watch('assets/scss/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('assets/js/', ['scripts']);

  // Watch image files
  gulp.watch('images/**/*.{png,gif,jpg}', ['images']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in _site, reload on change
  gulp.watch(['_site/assets/**/*']).on('change', livereload.changed);

});