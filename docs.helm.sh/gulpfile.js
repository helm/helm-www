var destination = process.env.GULP_DESTINATION || 'static';

// Load plugins
var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
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
  return gulp.src('themes/helm/static/src/sass/styles.scss')
    .pipe(sass().on('error', sass.logError))
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
      'themes/helmdocs/static/src/js/custom/foundation.offcanvas.js',
      'themes/helmdocs/static/src/js/custom/foundation.accordion.js',
      'themes/helmdocs/static/src/js/custom/foundation.dropdown.js',
      'themes/helmdocs/static/src/js/custom/foundation.slider.js',
      'themes/helmdocs/static/src/js/custom/foundation.tooltip.js'
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
gulp.task('scripts', gulp.series('scriptconcat', 'scriptminify'), function () {});


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
    'source/',
    'content/docs/*',
    '!content/docs/README.md'
  ], {force: true});
});


// Clone Docs for Hugo
gulp.task('clone', function(cb) {
  git.clone('https://github.com/helm/helm', {args: './source', quiet: false}, function(err) {
    // handle err
    cb(err);
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
    return gulp.src([
        'source/docs/quickstart.md',
        'source/docs/install.md',
        'source/docs/kubernetes_distros.md',
        'source/docs/install_faq.md',
        'source/docs/using_helm.md',
        'source/docs/plugins.md',
        'source/docs/rbac.md',
        'source/docs/tiller_ssl.md',
        'source/docs/securing_installation.md'
    ])
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
    return del([
      templatefiles,
      'content/README.md',
      'content/docs/README.md',
      'source/docs/index.md',
      'source/docs/README.md',
      'source/docs/chart_template_guide/tmp/',
      '!source/docs/chart_template_guide/index.md',
      'source/.git',
      'source/.github'
    ], {force: true});
  });
  gulp.task('reorg-templates', gulp.series(
    'template-rename',
    'template-move',
    'template-concat',
    'template-del'
  ), function () {});
  gulp.task('reorg', function () {
    gulp.start('reorg-using', 'reorg-charts', 'reorg-templates');
  });

  // inject TOML redirects for Hugo, to point '**/*.md' to '**/'
  gulp.task('redirect-inject', function() {
    return gulp.src('source/docs/**/*.md', '!source/docs/**/index.md')
      .pipe(foreach(function(stream, file){
        var aliasname = file.path.replace(/^.*[\\\/]/, '');
        var diraliasname = file.path.split("/").slice(-2).join("/");
        return stream
          .pipe(inject.prepend('+++\naliases = [\n\"' + aliasname + '\"\,\n\"' + diraliasname + '\"\,\n\"using\_helm\/' + aliasname + '\"\,\n\"developing\_charts\/' + aliasname + '\"\n]\n+++\n\n'))
      }))
      .pipe(gulp.dest('./'))
  });

  // links
  gulp.task('redirect-anchor-temp', function() {
    return gulp.src('source/docs/**/*.md')
      .pipe(foreach(function(stream, file){
        var anchorurl = (/(\)\])(.*)\.md/, "g")[1];
        return stream
          .pipe(stringreplace( anchorurl, '](#' ))
      }))
      .pipe(gulp.dest('source/docs/'))
  });

  gulp.task('redirect-subfolder', function() {
    return gulp.src('source/docs/helm/*.md')
      // update internal urls within the helm_commands
      .pipe(replace('](helm', '](../../helm/#helm'))
      .pipe(replace('.md)', ')'))
      .pipe(gulp.dest('source/docs/helm/'))
  });

  gulp.task('redirect-anchor-replace', function() {
    return gulp.src('source/docs/**/*.md')
      // update internal links from '*.md' to '#*'
        // omitting external links
      .pipe(replace(/(\]\()(?!http)(.*)(\.md\))/g, '](./#$2)'))
      // update quickstart and install links
      .pipe(replace(/\]\(.*install\.md/, '](../using_helm/#installing-helm'))
      .pipe(replace('#Install-Helm', '#installing-helm'))
      .pipe(replace('#quickstart]', '#quickstart-guide]'))
      .pipe(replace('#install)', '#installing-helm)'))
      .pipe(replace('#using_helm', '#using-helm'))
      // update charts urls
      .pipe(replace('chart_repository', 'developing_charts'))
      // update the provenance urls
      .pipe(replace('#provenance', '#helm-provenance-and-integrity'))
      // update the image paths in 'developing_charts'
      .pipe(replace('](images/', '](https://raw.githubusercontent.com/helm/helm/master/docs/images/'))
      .pipe(replace('.png)', '.png)'))
      // update tips and tricks link
      .pipe(replace('charts_tips_and_tricks', 'chart-development-tips-and-tricks'))
      // update security anchor link
      .pipe(replace('securing_installation', 'securing-your-helm-installation'))
      // update tiller ssl link
      .pipe(replace('#tiller_ssl', '#using-ssl-between-helm-and-tiller'))
      .pipe(replace('(tiller_ssl', '(#using-ssl-between-helm-and-tiller'))
      // related
      .pipe(replace('(related.md#', '(../related/#'))
      // update rbac links
      .pipe(replace('#rbac', '#role-based-access-control'))
      .pipe(replace('using_helm/rbac', 'using_helm/#role-based-access-control'))
      .pipe(replace('(rbac', '(#role-based-access-control'))
      .pipe(replace('##best-practices-for-securing-helm-and-tiller', '#best-practices-for-securing-helm-and-tiller'))
      .pipe(replace('](securing-your-helm-installation.md#role-based-access-control)', '](#rbac)'))

      .pipe(gulp.dest('source/docs/'))
  });

  gulp.task('redirect-underscores', function() {
    return gulp.src('source/docs/helm/*.md')
    .pipe(replace('_', '-'))
    .pipe(gulp.dest('source/docs/helm/'))
  });

  // gulp.task('copy-docs-source', function () {
  //   return gulp.src('source/docs/**/*')
  //     .pipe(gulp.dest('content/docs/'))
  //     .pipe(notify({message: 'Copied the re-rendered Docs content.'}));
  // });


  gulp.task('copyall', function () {
    return gulp.src('static/src/**/*')
      .pipe(gulp.dest('app/src'))
      .pipe(notify({message: 'Copied all.'}));
  });


// gulp clonedocs - use in conjunction with gulp build
gulp.task('clonedocs', gulp.series('clean', 'clone'), function() { });

gulp.task('build',
  gulp.series([
    'styles',
    'scripts',
    'images',
    'copy',
    'copyall',
    'redirect-inject',
    'redirect-subfolder',
    'reorg-using',
    'reorg-charts',
    'template-rename',
    'template-move',
    'template-concat',
    'template-del',
    'redirect-anchor-replace',
    'redirect-underscores'
    // 'copy-docs-source'
  ]),
  function() { }
);

// 'gulp' default task to build the site assets
gulp.task('default', gulp.series('clean', 'clonedocs', 'build'), function() { });


// 'gulp watch' to watch for changes during dev
gulp.task('watch', function () {

  gulp.watch('themes/helm/static/src/js/custom/init.js', gulp.series('scripts'));

  gulp.watch('themes/helm/static/img/src/**/*.{png,gif,jpg}', gulp.series('images'));

  gulp.watch('themes/helm/static/src/sass/**/*.scss', gulp.series('styles'));

  livereload.listen();

  gulp.watch([destination + '/**', destination + '/src/**']).on('change', livereload.changed);
});
