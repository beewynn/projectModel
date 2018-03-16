var gulp = require('gulp');
    scss = require('gulp-sass');
    watch = require('gulp-watch');
    mincss = require('gulp-clean-css');
    changed = require('gulp-changed');
    plumber = require('gulp-plumber');
    imagemin = require('gulp-imagemin');
    concatcss = require('gulp-concat-css')
    svgSprite = require('gulp-svg-sprite');
    sourcemaps = require('gulp-sourcemaps');
    fileinclude = require('gulp-file-include');
    autoprefixer = require('gulp-autoprefixer');


var path = {

    build: {
        html: 'build/html',
        htmlcom: 'build/html/components',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
        svg: 'build/svgSprite/'
    },

    src: {
        html: 'src/html/*.html',
        htmlcom: 'src/html/components/*.html',
        js: 'src/js/*.js',
        css: 'src/scss/import-styles.scss',
        img: ['src/img/*.*', '!src/img/*.tmp'],
        fonts: 'src/fonts/**/*.*',
        svg: 'src/svg/**/*.svg'
    },

    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        css: 'src/scss/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/*.*',
        svg: 'src/svg/**/*.svg'
    },
}

// CSS
gulp.task('css-build', function() {
    gulp.src(path.src.css)
    .pipe(plumber())
    .pipe(scss())
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
        browsers: ['last 4 versions'],
        cascade: false,
    }))
    .pipe(mincss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css))
});
// CSS

// FONTS
gulp.task('fonts-build', function() {
    gulp.src(path.src.fonts)
    .pipe(changed(path.build.fonts))
    .pipe(gulp.dest(path.build.fonts))
});
// FONTS

// JS
gulp.task('js-build-first', function() {
    gulp.src(path.src.js)
    .pipe(gulp.dest(path.build.js))
});

gulp.task('js-build', function() {
    gulp.src(path.src.js)
    .pipe(changed(path.build.js))
    .pipe(gulp.dest(path.build.js))
});
// JS

// IMG
gulp.task('img-build', function() {
    gulp.src(path.src.img)
    .pipe(changed(path.build.img))
    .pipe(imagemin())
    .pipe(gulp.dest(path.build.img))
});
// IMG

// HTML
gulp.task('html-build', function() {
    gulp.src(path.src.htmlcom)
    .pipe(changed(path.build.html))
    .pipe(gulp.dest(path.build.htmlcom))
    gulp.src(path.src.html)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(path.build.html))
});
// HTML

// SVG
config = {
    mode : {
        css: false,
        view: false,
        defs: false,
        stack: false,

        symbol : {
            sprite: 'sprite.svg',
            bust: false,
            example: true
        }
    }
};

gulp.task('svg-build', function() {
    gulp.src(path.src.svg)
    .pipe(changed(path.build.svg))
    .pipe(svgSprite(config))
    .pipe(gulp.dest(path.build.svg))
    gulp.src(path.src.html)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(path.build.html));
});
// SVG

// DEFAULT
gulp.task('default', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html-build');
    });
    watch([path.watch.css], function(event, cb) {
        gulp.start('css-build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js-build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('img-build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts-build');
    });
    watch([path.watch.svg], function(event, cb) {
        gulp.start('svg-build');
    });
});