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
//var babel = require("gulp-babel");
var babelrc = require('babelrc-rollup');
var babel = require('rollup-plugin-babel');
var rollup = require('rollup-stream');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var rename = require('gulp-rename');
var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var fs = require('fs-extra');

var paths = {
    startScript: 'src/js/peace.js',
    src: 'src/',
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
    runSequence('clean', 'pages', 'images', 'libs', ['styles', 'templates','scripts'], cb);
}); 

gulp.task('pages', function() {
    return gulp.src('src/*.html')
        .pipe(gulp.dest(paths.dist));
});

gulp.task('images', function() {
   return gulp.src('src/images/**/*.{svg,png,jpg}')
        .pipe(gulp.dest(paths.dist+'/images')); 
});

gulp.task('libs', function(cb) {
    return gulp.src('lib/**')
    .pipe(gulp.dest(paths.dist));
});


gulp.task('copy_data', function(cb) {
    //create dist-folder if it does not exist
    fs.mkdirsSync(paths.dist, {clobber : false});
     fs.copy('data', paths.dist+'/data', {clobber : false}, function(err){
         if (err) {
             console.error(err);
             return cb(err);
         }
        cb();
    });
    /*
    return gulp.src('data/**')
    .pipe(gulp.dest(paths.dist+'/data', {overwrite:false}));  */
});


gulp.task('clean', function() {
    // return the stream as the completion hint
    // '!'+paths.dist --> ignore parent dir

    return del([paths.dist+'/**', '!'+paths.dist, '!'+paths.dist+ '/data/**']);
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
      namespace: 'PeaceTemp.templates',
      noRedeclare: true, // Avoid duplicate declarations 
    }))
    .pipe(concat('peacetpl.js'))
    .pipe(gulp.dest(paths.dist+'/js'));
});


gulp.task('scripts', function() {
    return rollup({
        entry: './src/js/index.js',
        sourceMap: true,
        format: 'iife',
        moduleName: 'Peace',
        plugins: [
            babel({
                runtimeHelpers: true,
                exclude: 'node_modules/**'
            }),
            nodeResolve({
                jsnext: true,  // Default: false
                main: true,  // Default: true
                preferBuiltins: false,
                browser: true,
            }),
            commonjs({
                include: './node_modules/jquery/**',
                namedExports: {
                    './node_modules/jquery/dist/jquery.min.js':['jquery']
                }
            })
        ]}
    ).on('error', e => {
            console.error(`${e.stack}`);
    })
    .pipe(source('index.js', './src/js/'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(rename(uncompressedJs))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dist + '/js'));

  //  gulp.src("src/**/*.js")
/*        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat(uncompressedJs))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(paths.dist+'/js')); */
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