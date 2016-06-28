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
var runSequence = require('run-sequence');
var del = require('del');


var paths = {
    scripts: [
        'src/js/start.js','src/js/capfilters.js', 'src/js/init.js', 'src/js/filters.js', 'src/js/prepareOutputData.js', 
        'src/js/render.js', 'src/js/html.js', 'src/js/json.js',  'src/js/engines.js', 'src/js/engines-overview.js', 
        'src/js/engines-compare.js', 'src/js/utils.js', 'src/js/end.js'
        ],
    startScript: 'src/js/init.js',
    lib: 'lib/',
    templates: 'src/templates/*.hbs',
    dist: 'dist'
};

var uncompressedJs  = 'peace.js';
var compressedJs    = 'peace.min.js';

gulp.task('default', ['build','browser-sync', 'watch'], function() {
//  gulp.watch('sass/**/*.scss', ['styles']);
    //gulp.watch('js/**/*.js', ['lint']);
});

gulp.task('build', function(cb) {
    runSequence('clean', 'public', ['styles', 'templates','scripts'], cb);
}); 
    
gulp.task('public', function(cb) {
    return gulp.src(['src/*.html', 'lib/**'])
    .pipe(gulp.dest(paths.dist));
});

gulp.task('clean', function() {
    // return the stream as the completion hint
    return del([paths.dist]);
});


gulp.task('styles', function () {
	gulp.src('src/sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
        .pipe(concat('peace.css'))
		.pipe(gulp.dest(paths.dist+'/css'));
            //.pipe(browserSync.stream());
});

gulp.task('templates', function(){
  gulp.src(paths.templates)
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'Peace.templates',
      noRedeclare: true, // Avoid duplicate declarations 
    }))
    .pipe(concat('peacetpl.js'))
    .pipe(gulp.dest(paths.dist+'/js'));
});

gulp.task('scripts', function() {
    gulp.src(paths.scripts)
        .pipe(concat(uncompressedJs))
        .pipe(sourcemaps.init())
        .pipe(gulp.dest(paths.dist+'/js'));

});

gulp.task('watch', function() {
    gulp.watch('src/sass/**/*.scss', ['styles']);
    gulp.watch('src/**/*.js', ['scripts']);
    gulp.watch('src/templates/**/*.hbs', ['templates', browserSync.reload]);
    gulp.watch('src/**/*.html').on('change', browserSync.reload);

});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './'+paths.dist
        }
    });
   
    // gulp.watch('*.html').on('change', browserSync.reload);
    // browserSync.stream();
});

gulp.task('lint', function () {
	return gulp.src([paths.dist+'/js/peace.js' ])
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






