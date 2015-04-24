//
// Gulp file!
//
var   gulp      = require('gulp')
    , watch     = require('gulp-watch')
    , sass      = require('gulp-sass')
    , server    = require('gulp-express')
    , sync      = require('browser-sync')
    , sftp      = require('gulp-sftp')
    , reload    = sync.reload
    ;

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    sync({
        brower: null,
        debugInfo: false,
        open: false
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

gulp.task('dev', ['serve']);