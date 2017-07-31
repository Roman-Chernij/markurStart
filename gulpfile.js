    var gulp            = require('gulp'), // Подключаем Gulp
        sass            = require('gulp-sass'),// компилатор с SCSS в CSS
        browserSync     = require('browser-sync'),
        concat          = require('gulp-concat'),// соединяет файлы
        uglify          = require('gulp-uglifyjs'),// минифицирует JAVASCRIPT
        cssnano         = require('gulp-cssnano'),//минифицирет CSS
        rename          = require('gulp-rename'),//переименовывает файлы
        autoprefixer    = require('gulp-autoprefixer'),//добавлеет префиксы CSS
        del             = require('del'),
        imagemin        = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
        pngquant        = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
        cache           = require('gulp-cache'); // кеш для картинок, при сборке продакшена экономит время....вроди
        autopolyfiller  = require('gulp-autopolyfiller');// добавляет поддрежку старых браузеров для JAVASCRIPT
        merge           = require('event-stream').merge;
        order           = require("gulp-order");
        plumber         = require('gulp-plumber');
        babel           = require('gulp-babel');

    //CSS files
gulp.task('sass', function () {
     gulp.src([
        'app/libs/libs.scss',
        'app/scss/style.scss'
    ])
    .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer([
            'Android 2.3',
            'Android >= 4',
            'Chrome >= 20',
            'Firefox >= 24',
            'Explorer >= 8',
            'iOS >= 6',
            'Opera >= 12',
            'Safari >= 6'
        ]))
        .pipe(concat('style.css'))
        .pipe(cssnano('style.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(plumber.stop())
        .pipe(gulp.dest('app/dist'))
        .pipe(browserSync.reload({stream: true}))
});

//JavaScript files
gulp.task('autopolyfiller',['babel'], function () {
        return gulp.src('app/js/script.babel.js')
            .pipe(autopolyfiller('polyfill.js', {
                browsers: require('autoprefixer').default
            }))
            .pipe(gulp.dest('app/js'));
});

gulp.task('babel', function () {
 return gulp.src([
   "app/js/Helper.js",
   "app/js/Helper1.js",
   "app/js/App.js",
   "app/js/components/*.js"
 ])
     .pipe(concat('scripts.js'))
     .pipe(babel({
         presets: ['es2015']
     }))
     .pipe(rename({suffix: '.babel'}))
     .pipe(gulp.dest('app/js'))
});

gulp.task('scripts',['autopolyfiller'], function () {
    return gulp.src([
        "app/js/polyfill.js",
        "app/libs/*.js",
        "app/js/scripts.babel.js"
    ])
        .pipe(concat('index.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('app/dist'))
        .pipe(browserSync.reload({stream: true}))
});



gulp.task('browserSync', function () {
    browserSync({
        server:{
            baseDir: 'app'
    },
    notify: false
    });
});

gulp.task('img', function() {
        return gulp.src('app/img/**/*')
            .pipe(cache(imagemin({
                interlaced: true,
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()]
            })))
            .pipe(gulp.dest('app/img'));
    });

gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('clean', function () {
    return del.sync('app/dist');
});

gulp.task('watch', ['browserSync', 'sass', 'scripts'], function () {
    gulp.watch('app/scss/**/*.+(scss|sass)' , ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/components/*.js', ['scripts']);
    gulp.watch('app/libs/libs.scss', browserSync.reload);
    gulp.watch('app/img/**/*', ['img']);
});

//gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function () {

 //   var buildCss = gulp.src('app/css/*.css')
  //      .pipe(concat('style.css'))
  //      .pipe(rename({suffix: '.min'}))
   //     .pipe(gulp.dest('dist/css'));

  //  var buildFonts = gulp.src('app/fonts/**/*')
   //     .pipe(gulp.dest('dist/fonts'));

  //  var duildJs = gulp.src('app/js/**/*')
  //      .pipe(gulp.dest('dist/js'));

   // var duildHtml = gulp.src('app/*.html')
  //      .pipe(gulp.dest('dist/'));

//});
