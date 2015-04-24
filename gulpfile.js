//
// Gulp file!
//
var   gulp      = require('gulp')
    , watch     = require('gulp-watch')
    , sass      = require('gulp-sass')
    , server    = require('gulp-express')
    , sync      = require('browser-sync')
    , gutil     = require('gulp-util')
    , ftp       = require('gulp-ftp')
    , reload    = sync.reload
    ;

// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'upload'], function() {

    sync({
        brower: null,
        debugInfo: false,
        open: false,
        baseDir: "HTML"
    });

    gulp.watch("HTML/library/css/**/*.scss", ['sass']);
    gulp.watch("HTML/*.html").on('change', reload);
    gulp.watch("HTML/**/*.php").on('change', reload);
    gulp.watch("HTML/**/*", ['upload']);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("HTML/library/css/**/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("HTML/library/css"))
        .pipe(sass({sourcemap: true}))
        .pipe(reload({stream: true}));
});

gulp.task('upload', function () {
    return gulp.src('HTML/**/*')
        .pipe(ftp({
            host: '192.185.39.232',
            user: 'rpguide',
            pass: 'Titpw4dG!',
            remotePath: '/public_html/azkai.io_stage'
        }))
        // you need to have some kind of stream after gulp-ftp to make sure it's flushed 
        // this can be a gulp plugin, gulp.dest, or any kind of stream 
        // here we use a passthrough stream 
        .pipe(reload({stream: true}));
});

gulp.task('dev', ['serve']);