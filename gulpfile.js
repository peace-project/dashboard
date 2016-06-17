/*eslint-env node */

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();


var paths = {
    scripts: [
        'src/start.js','src/capfilters.js', 'src/init.js', 'src/filters.js', 'src/prepareOutputData.js', 
        'src/render.js', 'src/html.js', 'src/json.js',  'src/engines.js', 'src/engines-overview.js', 
        'src/engines-compare.js', 'src/utils.js', 'src/end.js'
        ],
    startScript: 'src/init.js',
    lib: 'lib/',
    templates: 'templates/*.hbs',
    dist: 'dist'
};

var uncompressedJs  = 'peace.js';
var compressedJs    = 'peace.min.js';


gulp.task('default', ['styles', 'templates','scripts', 'browser-sync', 'watch'], function() {
//  gulp.watch('sass/**/*.scss', ['styles']);
    //gulp.watch('js/**/*.js', ['lint']);

});

gulp.task('styles', function () {
	gulp.src('sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
        .pipe(concat('main.css'))
		.pipe(gulp.dest('./css'))
            .pipe(browserSync.stream());
});


gulp.task('watch', function() {
    gulp.watch('sass/**/*.scss', ['styles']);
    gulp.watch('src/**/*.js', ['scripts']);
    gulp.watch('templates/**/*.hbs', ['templates', browserSync.reload]);
    gulp.watch('*.html').on('change', browserSync.reload);

});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
   
   // gulp.watch('*.html').on('change', browserSync.reload);
    //browserSync.stream();
});

gulp.task('lint', function () {
	return gulp.src(['js/main.js', 'js/peace-charts.js' ])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

gulp.task('templates', function(){
  gulp.src(paths.templates)
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'Peace.templates',
      noRedeclare: true, // Avoid duplicate declarations 
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./js'));
});

gulp.task('scripts', function() {
    gulp.src(paths.scripts)
        .pipe(concat(uncompressedJs))
        .pipe(sourcemaps.init())
        .pipe(gulp.dest('./js'));

});




