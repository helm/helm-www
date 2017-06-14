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
  replace = require('gulp-string-replace'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  livereload = require('gulp-livereload'),
  del = require('del');
  streamqueue = require('streamqueue');
  cssnano = require('gulp-cssnano');
  sourcemaps = require('gulp-sourcemaps');
  git = require('gulp-git');
  runSequence = require('run-sequence');


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
  return del([
    destination + '/src/**/*',
    'source/'
  ], {force: true});
});


// Clone Docs for Hugo
gulp.task('clone', function() {
  git.clone('https://github.com/kubernetes/helm', {args: './source'}, function(err) {
    // handle err
  });
});


/*
  Edits to control how Hugo outputs the .md content:

  * concat contents for each subsection, to enforce the sort order
    (in lieu of TOML that defines the weight of each page)
  * remove the index chart_template_guide to avoid conflict
  *

*/

  // Reorg Docs for Hugo
  gulp.task('reorg-using', function() {
    return streamqueue({ objectMode: true },
      gulp.src('source/docs/quickstart.md'),
      gulp.src('source/docs/install.md'),
      gulp.src('source/docs/kubernetes_distros.md'),
      gulp.src('source/docs/install_faq.md'),
      gulp.src('source/docs/using_helm.md'),
      gulp.src('source/docs/plugins.md')
    )
    .pipe(concat('index.md'))
    .pipe(gulp.dest('source/docs/using_helm/'))
  });

  gulp.task('reorg-charts', function() {
    return streamqueue({ objectMode: true },
      gulp.src('source/docs/charts.md'),
      gulp.src('source/docs/charts_hooks.md'),
      gulp.src('source/docs/charts_tips_and_tricks.md'),
      gulp.src('source/docs/chart_repository.md'),
      gulp.src('source/docs/chart_repository_sync_example.md'),
      gulp.src('source/docs/provenance.md'),
      gulp.src('source/docs/chart_tests.md'),
      gulp.src('source/docs/chart_repository_faq.md')
    )
    .pipe(concat('index.md'))
    .pipe(gulp.dest('source/docs/developing_charts/'))
  });

  var templatefiles = 'source/docs/chart_template_guide/**.md';
  gulp.task('template-rename', function() {
    return gulp.src('source/docs/chart_template_guide/index.md')
      .pipe(rename('intro.md'))
      .pipe(gulp.dest('source/docs/chart_template_guide/'))
      del([templatefiles, '!source/docs/chart_template_guide/index.md'])
  });
  gulp.task('template-move', function() {
    return gulp.src(templatefiles)
      .pipe(gulp.dest('source/docs/chart_template_guide/tmp/'))
  });
  gulp.task('template-concat', function() {
    return streamqueue({ objectMode: true },
      gulp.src('source/docs/chart_template_guide/tmp/intro.md'),
      gulp.src('source/docs/chart_template_guide/tmp/getting_started.md'),
      gulp.src('source/docs/chart_template_guide/tmp/builtin_objects.md'),
      gulp.src('source/docs/chart_template_guide/tmp/values_files.md'),
      gulp.src('source/docs/chart_template_guide/tmp/functions_and_pipelines.md'),
      gulp.src('source/docs/chart_template_guide/tmp/control_structures.md'),
      gulp.src('source/docs/chart_template_guide/tmp/variables.md'),
      gulp.src('source/docs/chart_template_guide/tmp/named_templates.md'),
      gulp.src('source/docs/chart_template_guide/tmp/accessing_files.md'),
      gulp.src('source/docs/chart_template_guide/tmp/notes_files.md'),
      gulp.src('source/docs/chart_template_guide/tmp/subcharts_and_globals.md'),
      gulp.src('source/docs/chart_template_guide/tmp/debugging.md'),
      gulp.src('source/docs/chart_template_guide/tmp/wrapping_up.md'),
      gulp.src('source/docs/chart_template_guide/tmp/yaml_techniques.md'),
      gulp.src('source/docs/chart_template_guide/tmp/data_types.md')
    )
    .pipe(concat('index.md'))
    .pipe(gulp.dest('source/docs/chart_template_guide/'))
  });
  gulp.task('template-del', function() {
    del([templatefiles, 'source/docs/chart_template_guide/tmp/', '!source/docs/chart_template_guide/index.md'])
  });
  gulp.task('reorg-templates', function () {
    runSequence('template-rename',
                'template-move',
                'template-concat',
                'template-del');
  });

  gulp.task('reorg', function () {
    gulp.start('reorg-using', 'reorg-charts', 'reorg-templates');
  });


// 'gulp' default task to build the site assets
gulp.task('default', function () {
  runSequence('clean',
              'clone',
              ['styles', 'scripts', 'images', 'copy', 'copyall'],
              'reorg')
});


// 'gulp watch' to watch for changes during dev
gulp.task('watch', function () {

  gulp.watch('themes/helmdocs/static/src/js/custom/init.js', ['scripts']);

  gulp.watch('themes/helmdocs/static/img/src/**/*.{png,gif,jpg}', ['images']);

  gulp.watch('themes/helmdocs/static/src/sass/**/*.scss', ['styles']);

  livereload.listen();

  gulp.watch([destination + '/**', destination + '/src/**']).on('change', livereload.changed);
});
