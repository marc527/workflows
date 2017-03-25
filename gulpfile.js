var gulp = require('gulp'),
  gutil = require('gulp-util'),
  coffee = require('gulp-coffee'),
  concat = require('gulp-concat'),
  browserify = require('gulp-browserify'),
  connect = require('gulp-connect'),
  compass = require('gulp-compass');

var env, coffeeSources, jsSources, sassSources, htmlSources, jsonSources, outputDir;

env= process.env.NODE.ENV || 'development';
if(env === 'development') {
  outputDir = 'builds/development/';
} else {
  outputDir = 'builds/production/';
}

coffeeSources = ['components/coffee/*.coffee'];
jsSources = ['components/scripts/*.js'];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];

gulp.task('coffee', function(){
   gulp.src(coffeeSources)
    .pipe(coffee({bare: true})
      .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function(){
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload())
});

gulp.task('compass', function(){
  gulp.src(sassSources)
    .pipe(compass({
      css: outputDir + 'css',
      sass: 'components/sass',
      image: outputDir + 'images',
      style: 'expanded'
    })
    .on('error', gutil.log))
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(connect.reload())
});

gulp.task('watch', function(){
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*.scss', ['compass']);
  gulp.watch(htmlSources, ['html']);
  gulp.watch(jsonSources, ['json']);
});

gulp.task('connect', function(){
  connect.server({
    root: outputDir,
    livereload: true
  });
});

gulp.task('html', function(){
  gulp.src(htmlSources)
    .pipe(connect.reload())
});

gulp.task('json', function(){
  gulp.src(jsonSources)
    .pipe(connect.reload())
});

gulp.task('default', ['coffee', 'js', 'compass', 'connect', 'watch']);
