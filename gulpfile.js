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

gulp.task('default', function(cb) {
    runSequence('build', 'test', cb);
});

gulp.task('build', function(cb) {
    runSequence('clean', 'copy:data', 'pages', 'images', 'libs', ['styles', 'templates','scripts'], cb);
}); 

gulp.task('pages', function() {
    return gulp.src('src/*.html')
        .pipe(gulp.dest(paths.dist));
});

gulp.task('images', function() {
   return gulp.src('src/images/**/*.{svg,png,jpg}')
        .pipe(gulp.dest('dist/images')); 
});

gulp.task('libs', function(cb) {
    return gulp.src('lib/**')
    .pipe(gulp.dest(paths.dist));
});

gulp.task('copy:data', function(cb) {
    return gulp.src('data/**')
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

function watch() {
    gulp.watch('src/**/*.html', ['pages', browserSync.reload]);
    gulp.watch('src/sass/**/*.scss', ['styles' , browserSync.reload]);
    gulp.watch('src/**/*.js', ['scripts', browserSync.reload]);
    gulp.watch('lib/**', ['lib', browserSync.reload]);
    gulp.watch('src/templates/**/*.hbs', ['templates', browserSync.reload]);
}

gulp.task('test', function() {
    browserSync.init({
        notify: false,
        server: {
            baseDir: paths.dist
        }
    });

    //call watch task
    watch(); 
});



gulp.task('lint', function () {
	return gulp.src([paths.dist+'/js/peace.js' ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});