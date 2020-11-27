const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');

// sass
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const { dest, MODE } = require('./paths');

// File's paths
const dirs = {
	sass: [
		'../src/sass/*.scss'
	],
	assets: [
		'../src/images/*'
	],
	dest,
	assetsDest: 'images/'
};

function styles() {
	return gulp
		.src(dirs.sass)
		.pipe(sassGlob())
		.pipe(plumber(error => console.log(error.message)))
		.pipe(sass.sync())
		.pipe(autoprefixer())
		.pipe(cleanCSS({ compatibility: 'ie8' }))
		.pipe(gulp.dest(dirs.dest));
}

function assets() {
	return gulp
		.src(dirs.assets)
		.pipe(gulp.dest((dirs.dest + '/images/')));
}

function watch() {
	gulp.watch(['../src/sass/**/*.scss'], styles);
	gulp.watch(['../src/images/*'],assets);
}

// SASS
gulp.task('styles', styles);
gulp.task('watch', watch);
gulp.task('assets', assets);

const defaultTasks = [styles, assets];
if (MODE === 'development') {
	defaultTasks.push(watch);
}

gulp.task('default', gulp.parallel(defaultTasks));
