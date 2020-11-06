var destination = process.env.GULP_DESTINATION || 'app';

// Load plugins
var gulp = require('gulp'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  del = require('del'),
  git = require('gulp-git'),
  foreach = require('gulp-foreach'),
  inject = require('gulp-inject-string'),
  replace = require('gulp-replace'),
  stringreplace  = require('gulp-string-replace');

// Clean
gulp.task('clean', function () {
  return del([
    'source/',
    'content/docs/*',
    '!content/docs/README.md'
  ], {force: true});
});


// Clone Docs for Hugo
gulp.task('clone', function(cb) {
  git.clone('https://github.com/helm/helm', {args: './source --branch dev-v2', quiet: false}, function(err) {
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
        'source/docs/kubernetes_apis.md',
        'source/docs/kubernetes_distros.md',
        'source/docs/install_faq.md',
        'source/docs/using_helm.md',
        'source/docs/plugins.md',
        'source/docs/rbac.md',
        'source/docs/tiller_ssl.md',
        'source/docs/securing_installation.md'
    ], { allowEmpty: true })
    .pipe(concat('index.md'))
    .pipe(gulp.dest('source/docs/using_helm/'))
  });

  gulp.task('reorg-helmcmd', function() {
    return gulp.src(['source/docs/helm/*.md'], { allowEmpty: true })
    .pipe(concat('index.md'))
    .pipe(gulp.dest('source/docs/helm/'))
  });

  gulp.task('reorg-charts', function() {
    return gulp.src([
      'source/docs/charts.md',
      'source/docs/charts_hooks.md',
      'source/docs/charts_tips_and_tricks.md',
      'source/docs/chart_repository.md',
      'source/docs/chart_repository_sync_example.md',
      'source/docs/provenance.md',
      'source/docs/chart_tests.md',
      'source/docs/chart_repository_faq.md'
    ], { allowEmpty: true })
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
  gulp.task('template-best-move', function() {
    return gulp.src('source/docs/chart_best_practices/**.md')
      .pipe(gulp.dest('source/docs/chart_best_practices/tmp/'))
  });
  gulp.task('template-concat', function() {
    return gulp.src([
        'source/docs/chart_template_guide/tmp/intro.md',
        'source/docs/chart_template_guide/tmp/getting_started.md',
        'source/docs/chart_template_guide/tmp/builtin_objects.md',
        'source/docs/chart_template_guide/tmp/values_files.md',
        'source/docs/chart_template_guide/tmp/functions_and_pipelines.md',
        'source/docs/chart_template_guide/tmp/control_structures.md',
        'source/docs/chart_template_guide/tmp/variables.md',
        'source/docs/chart_template_guide/tmp/named_templates.md',
        'source/docs/chart_template_guide/tmp/accessing_files.md',
        'source/docs/chart_template_guide/tmp/notes_files.md',
        'source/docs/chart_template_guide/tmp/subcharts_and_globals.md',
        'source/docs/chart_template_guide/tmp/helm_ignore_file.md',
        'source/docs/chart_template_guide/tmp/debugging.md',
        'source/docs/chart_template_guide/tmp/wrapping_up.md',
        'source/docs/chart_template_guide/tmp/yaml_techniques.md',
        'source/docs/chart_template_guide/tmp/data_types.md'
    ], { allowEmpty: true })
    .pipe(concat('index.md'))
    .pipe(gulp.dest('source/docs/chart_template_guide/'))
  });
  gulp.task('template-bestpractices', function() {
    return gulp.src([
        'source/docs/chart_best_practices/tmp/README.md',
        'source/docs/chart_best_practices/tmp/conventions.md',
        'source/docs/chart_best_practices/tmp/values.md',
        'source/docs/chart_best_practices/tmp/templates.md',
        'source/docs/chart_best_practices/tmp/requirements.md',
        'source/docs/chart_best_practices/tmp/labels.md',
        'source/docs/chart_best_practices/tmp/pods.md',
        'source/docs/chart_best_practices/tmp/custom_resource_definitions.md',
        'source/docs/chart_best_practices/tmp/rbac.md'
    ], { allowEmpty: false })
    .pipe(concat('index.md'))
    .pipe(gulp.dest('source/docs/chart_best_practices/'))
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
    'template-best-move',
    'template-concat',
    'template-bestpractices',
    'template-del'
  ), function () {});
  gulp.task('reorg', function () {
    gulp.start('reorg-using', 'reorg-helmcmd', 'reorg-charts', 'reorg-templates');
  });

  // inject TOML redirects for Hugo, to point '**/*.md' to '**/'
  gulp.task('redirect-inject', function() {
    return gulp.src('content/docs/**/*.md', '!content/docs/**/index.md')
      .pipe(foreach(function(stream, file){
        var aliasname = file.path.replace(/^.*[\\\/]/, '');
        var diraliasname = file.path.split("/").slice(-2).join("/");
        return stream
          .pipe(inject.prepend('+++\naliases = [\n\"' + aliasname + '\"\,\n\"' + diraliasname + '\"\,\n\"using\_helm\/' + aliasname + '\"\,\n\"developing\_charts\/' + aliasname + '\"\n]\n+++\n\n'))
      }))
      .pipe(gulp.dest('./content/docs'))
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
      .pipe(replace('](helm', '](../../docs/helm/#helm'))
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
      .pipe(replace('Chart Development Guide](./#charts', 'Chart Development Guide](../developing_charts/'))
      .pipe(replace('chart_repository', 'developing_charts'))
      // update the provenance urls
      .pipe(replace('#provenance', '#helm-provenance-and-integrity'))
      // update the image paths in 'developing_charts'
      .pipe(replace('](images/', '](https://raw.githubusercontent.com/helm/helm/dev-v2/docs/images/'))
      // chart best practices toc
      .pipe(replace('](./#conventions', '](./#general-conventions'))
      .pipe(replace('](./#requirements', '](./#requirements-files'))
      .pipe(replace('](./#labels', '](./#labels-and-annotations'))
      .pipe(replace('](./#pods', '](./#pods-and-podtemplates'))
      .pipe(replace('](./#custom_resource_definitions', '](./#custom-resource-definitions'))
      // misc
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
    .pipe(replace('](../../docs/helm/#helm_', '](../../docs/helm/#helm-'))
    .pipe(gulp.dest('source/docs/helm/'))
  });

  gulp.task('copy-docs-source', function () {
    return gulp.src('source/docs/**/*')
      .pipe(gulp.dest('content/docs/'))
  });


// gulp clonedocs - use in conjunction with gulp build
gulp.task('clonedocs', gulp.series('clean', 'clone'), function() { });

gulp.task('build',
  gulp.series([
    'redirect-inject',
    'redirect-subfolder',
    'reorg-using',
    'reorg-helmcmd',
    'reorg-charts',
    'template-rename',
    'template-move',
    'template-best-move',
    'template-concat',
    'template-bestpractices',
    'template-del',
    'redirect-anchor-replace',
    'redirect-underscores',
    'copy-docs-source'
  ]),
  function() {}
);

// 'gulp' default task to build the site assets
gulp.task('default', gulp.series('clonedocs', 'build'), function() { });
