/*
author: duc ngo viet
*/
var gulp = require('gulp');
var color = require('gulp-color');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var hb = require('gulp-hb');
var cachebust = require('gulp-cache-bust');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var babel = require('gulp-babel');
var gutil = require('gulp-util');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var path = require('path');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');

function swallowError (error) {
	console.log("ERROR");
	// If you want details of the error in the console
	console.log(color(error.toString(), 'red'));
	this.emit('end')
}

// before reload browser, rebuild js
gulp.task('reload-browser', ['js'], function(){
	console.log(color('browsersync reloaded', 'green'));
	browserSync.reload();
});

/**
 * transforms src/js/main.jsx to public/js/main.js
 */
gulp.task('js', function() {
    // Assumes a file has been transformed from
    return  browserify('./src/js/main.jsx')
      .transform("babelify", {presets: ["es2015"], plugins: ["inferno"]})
      .bundle()
      .on('error', swallowError)
      .pipe(source('main.js'))
      .pipe(buffer())
      // .pipe(uglify())
      .pipe(gulp.dest('./public/js'))
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {

  console.log(color('create css from scss', 'green'));

  return gulp.src("./src/scss/style.scss")
    .pipe(sass())
    .on('error', swallowError)
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest("./public/css"))
    .pipe(browserSync.stream());
});

// create html out of handlebars
gulp.task('handlebars', function () {
  'use strict';

  return gulp.src(['./*.hbs'])
    .pipe(hb({
      data: './data.json',
      partials: "./src/components/**/*.hbs",
      debug: true
    }))
    .on("error", swallowError)
    .pipe(cachebust({
      type: 'timestamp'
    }))
    .pipe(rename({
      extname: ".html"
    }))
    .pipe(gulp.dest('./'));
});

// Static Server + watching scss/html files
gulp.task('serve', ['handlebars', 'sass', 'js'], function() {

  browserSync.init({
    server: "./",
    online: false,
    notify: false,
    ghostMode: false
  });

  gulp.watch("./src/**/*.scss", ['sass']);
  gulp.watch("./src/js/**/*.js", ['reload-browser']);
  gulp.watch("./src/js/**/*.jsx", ['reload-browser']);
  gulp.watch("./**/*.hbs", ['handlebars', 'reload-browser', 'vendors', 'fonts' ,'assets', 'svgstore']); // when saving hbs files, everything except scss will be built
  gulp.watch("./*.json", ['handlebars', 'reload-browser']);
});

gulp.task('assets', () =>
		gulp.src('src/assets/**/*')
				.pipe(imagemin([
						imageminJpegRecompress({
								progressive: true,
								max: 80,
								min: 70
						})
				]))
				.pipe(gulp.dest('public/assets'))
);

gulp.task('fonts', () =>
  gulp.src(['src/fonts/**/*']).pipe(gulp.dest('public/fonts'))
);

gulp.task('vendors', () =>
  gulp.src(['src/vendors/**/*']).pipe(gulp.dest('public/vendors'))
);

gulp.task('svgstore', function () {
  return gulp
    .src('src/icons/*.svg')
    .pipe(svgmin(function (file) {
        var prefix = path.basename(file.relative, path.extname(file.relative));
        return {
            plugins: [{
                cleanupIDs: {
                    prefix: prefix + '-',
                    minify: true
                }
            }]
        }
    }))
    .pipe(svgstore())
    .pipe(gulp.dest('public/assets'));
});

gulp.task('default', ['svgstore', 'vendors', 'fonts' ,'assets', 'serve']);
