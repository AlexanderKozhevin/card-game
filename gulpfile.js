//
// Coded with passion by Alexander Kozhevin
//

var gulp = require('gulp');

// gulp-load-plugins include all packages beginning with "gulp"
// To use packages which don't begin with *gulp* - add their name in *pattern* property.
// This little thing helps us to minify number of declarations.
var $ = require('gulp-load-plugins')({
  rename: {
    'main-bower-files': "bowerfiles",
    'sassdoc': 'sassdoc'
  },
  pattern: ['gulp-*', 'gulp.*', 'sassdoc', 'main-bower-files', 'run-sequence']
});


//
// Additional files to be included, which not mentioned in **main** in bower.json of packages
//
var jslibs = [];
var csslibs = [
  "bower_components/angular-material/angular-material.layouts.min.css",
];
var i18n_files = [
  "bower_components/angular-i18n/angular-locale_ru-ru.js",
]


//
// Libs compiler
//
gulp.task('jslibs', function() {
    var array = jslibs.concat($.bowerfiles("**/*.js", {base: "bower_components"}))
    return gulp.src(array)
      .pipe($.concat('libs.js'))
      .pipe(gulp.dest('production/assets/js'))
});

gulp.task('csslibs', function() {
    var array = csslibs.concat($.bowerfiles("**/*.css", {base: "bower_components"}))
    return gulp.src(array)
      .pipe($.concat('libs.css'))
      .pipe(gulp.dest('production/assets/css'))
});

gulp.task('templates', function() {
	return gulp.src(['source/view/**/*.jade', 'source/components/**/*.jade'])
  .pipe($.jadeGlobbing())
	.pipe($.jade())
  .pipe($.angularTemplatecache({standalone: true}))
	.pipe(gulp.dest('production/assets/js'))
	.pipe($.connect.reload());
});
gulp.task('index', function() {
	return gulp.src(['source/index.jade'])
  .pipe($.jadeGlobbing())
	.pipe($.jade())
	.pipe(gulp.dest('production/assets/'))
	.pipe($.connect.reload());
});

//
// Assets
//
gulp.task('locales', function() {
  return gulp.src(['source/locales/*.yml'])
  .pipe($.yaml())
  .pipe(gulp.dest('production/locales'))
});

gulp.task('copyi18n', function() {
  gulp.src(i18n_files).pipe($.copy('production/locales', {prefix: 2}));
});

gulp.task('sassdocs',  function() {
	return gulp.src('source/style/**/*.scss')
	.pipe($.sassdoc({
    dest: "production/sassdoc"
  }))
});

gulp.task('copy_flags', function() {
  // gulp.src(['bower_components/flag-icon-css/flags/**/*']).pipe(gulp.dest('production/assets/flags'));
});


//
// Files minification
//
gulp.task('uglify', function() {
  return gulp.src(['production/assets/**/*.js'])
    .pipe($.ngAnnotate())
    .pipe($.uglify({output: {ascii_only: true}}))
    .pipe(gulp.dest('production/assets'))
});

gulp.task('gzip', function() {
  gulp.src(['production/assets/**/*.js','production/assets/**/*.css'])
    .pipe($.gzip())
    .pipe(gulp.dest('production/assets'))
});


//
// HTML, JS, CSS compilers
//


gulp.task('sass',  function() {
	return gulp.src(['source/style/**/*.scss'])
  .pipe($.sassGlob())
	.pipe($.sass().on('error', $.sass.logError))
	.pipe(gulp.dest('production/assets/css'))
	.pipe($.connect.reload());
});

gulp.task('coffee', function() {
  gulp.src(['source/app/**/*.coffee', 'source/components/**/*.coffee'])
    .pipe($.coffee())
    .pipe($.concat('app.js'))
    .pipe(gulp.dest('production/assets/js'))
    .pipe($.connect.reload());
});

gulp.task('ngdocs', [], function () {
  var gulpDocs = require('gulp-ngdocs');
  return gulp.src('production/assets/js/app.js')
    .pipe(gulpDocs.process())
    .pipe(gulp.dest('./docs'));
});
//
// §er for file changes
//
gulp.task('watch', function(){
  gulp.watch(['source/style/**/*.scss', 'source/components/**/*.scss'], ['sass', 'sassdocs']);
  gulp.watch(['source/view/**/*.jade', 'source/components/**/*.jade'], ['templates']);
  gulp.watch(['source/index.jade'], ['index']);
  gulp.watch(['source/app/**/*.coffee', 'source/components/**/*.coffee'], ['coffee', 'ngdocs']);
  gulp.watch('source/locales/*.yml', ['locales']);
});


//
// Compile and minify js files
//
gulp.task('production', function(){
  $.runSequence('uglify', 'gzip');
})


//
// Gulp server
//
gulp.task('connect', function() {
  $.connect.server({
    root: 'production',
    livereload: true,
    fallback: 'production/assets/index.html',
    port: 8082
  });
});

gulp.task('connect_ngdocs', function() {
  $.connect.server({
    root: 'docs',
    livereload: false,
    fallback: 'docs/index.html',
    port: 8083
  });
});

gulp.task('libs', ['jslibs', 'csslibs'])
gulp.task('compile', ['libs', 'sass', 'templates', 'coffee', 'copyi18n', 'locales', 'sassdocs', 'ngdocs'])


gulp.task('server', ['compile', 'watch', 'connect']);

gulp.task('default', ['server'])
