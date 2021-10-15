const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

const cssFiles = [
	'./node_modules/normalize.css/normalize.css',
	'./src/css/some.css',
	'./src/css/other.css'
]

const jsFiles = [
	'./src/js/lib.js',
	'./src/js/some.js'
]

function styles() {
	return gulp.src(cssFiles)
		.pipe(concat ('all.css'))
		.pipe(autoprefixer({
         	browsers: ['> 0.01%'],
         	overrideBrowserslist:  ['last 2 versions'],
         	cascade: false
        }))
        .pipe(cleanCSS({level: 2}))
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.stream());
}

function scripts() {
	return gulp.src(jsFiles)
		.pipe(concat ('all.js'))
		.pipe(uglify({
			toplevel: true
		}))
		.pipe(gulp.dest('./dist/js'))
		.pipe(browserSync.stream());
}

function watch() {
	    browserSync.init({
        server: {
            baseDir: "./"
        }
        //tunel: True
    });

	gulp.watch('./src/css/**/*.css', styles);
	gulp.watch('./src/js/**/*.js', scripts);
	gulp.watch('./*.html').on('change',browserSync.reload);

}

function clean() {
	return del(['dist/*']);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);

gulp.task('dist', gulp.series (clean,
					gulp.parallel(styles,scripts)
					));

gulp.task('dev', gulp.series('dist','watch'));



