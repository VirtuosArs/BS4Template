/* Needed gulp config */

var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

/* Scripts task */
gulp.task('scripts', function () {
    return gulp.src([
        /* Add your JS files here, they will be combined in this order */
        'src/js/vendor/jquery.min.js',
        'src/js/vendor/popper.min.js',
        'src/js/vendor/tether.min.js',
        'src/js/vendor/bootstrap.min.js',
        'src/js/vendor/scrollreveal.min.js',
        'src/js/vendor/jquery.easing.min.js',
    ])
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('copy', function() {
  
    gulp.src(['node_modules/scrollreveal/dist/*.js'])
      .pipe(gulp.dest('vendor/scrollreveal'))
  
    gulp.src(['node_modules/jquery.easing/*.js'])
      .pipe(gulp.dest('vendor/jquery-easing'))
  
  })

gulp.task('minify-custom', function () {
    return gulp.src([
        /* Add your JS files here, they will be combined in this order */
        'src/js/custom.js'
    ])
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(gulp.dest('src/js'));
});

/* Sass task */
gulp.task('sass', function () {
    gulp.src('src/scss/style.scss')
        .pipe(plumber())
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'expanded',
            precision: 10
        }))

        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(gulp.dest('src/css'))

        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'))
        .pipe(gulp.dest('src/css'))
        .pipe(reload({ stream: true }));
});

gulp.task('merge-styles', function () {

    return gulp.src([
        'src/css/vendor/bootstrap.css',
        'src/css/vendor/animate.css',
    ])
        .pipe(concat('styles-merged.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'))
        .pipe(reload({ stream: true }));
});

gulp.task('move-html', function () {
    return gulp.src([
        'src/index.html',
    ])
        .pipe(concat('index.html'))
        .pipe(gulp.dest('dist/'))
        .pipe(reload({ stream: true }));
});

gulp.task('move-img', function () {
    return gulp.src([
        'src/img/*',
    ])
        // .pipe(concat('index.html'))
        .pipe(gulp.dest('dist/img'))
        .pipe(reload({ stream: true }));
});

/* Reload task */
gulp.task('bs-reload', function () {
    browserSync.reload();
});

/* Prepare Browser-sync for localhost */
gulp.task('browser-sync', function () {
    browserSync.init(['src/css/*.css', 'src/js/*.js'], {

        proxy: 'localhost/ankushsankhe/'
        /* For a static server you would use this: */
        /*
        server: {
            baseDir: './'
        }
        */
    });
});


// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function () {

    browserSync.init({
        server: "./src"
    });

    gulp.watch(['src/scss/*.scss', 'src/scss/**/*.scss'], ['sass'])
    /* Watch app.js file, run the scripts task on change. */
    gulp.watch(['src/js/custom.js'], ['minify-custom'])
    gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'], ['sass']);
    gulp.watch("dist/*.html").on('change', browserSync.reload);
    gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('default', ['scripts', 'merge-styles', 'serve']);