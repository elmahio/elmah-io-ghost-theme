"use strict";

const { series, watch, src, dest, parallel, task } = require('gulp');
const pump = require('pump');
const sass = require('gulp-sass')(require('sass'));
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');

const livereload = require('gulp-livereload');
const uglify = require('gulp-terser');
const beeper = import('beeper');
const concat = require("gulp-concat");
const cssmin = require("gulp-cssmin");
const merge = import("merge-stream");
const replace = require("gulp-replace");
const sourcemaps = require("gulp-sourcemaps");
const bundleconfig = require("./bundleconfig.json");


const regex = {
    css: /\.css$/,
    js: /\.js$/
};

function getBundles(regexPattern) {
    return bundleconfig.filter(function (bundle) {
        return regexPattern.test(bundle.outputFileName);
    });
}

function serve(done) {
    livereload.listen();
    done();
}

const handleError = (done) => {
    return function (err) {
        if (err) {
            beeper;
        }
        return done(err);
    };
};

function hbs(done) {
    pump([
        src(['*.hbs', '**/**/*.hbs', '!node_modules/**/*.hbs']),
        livereload()
    ], handleError(done));
}

function css(done) {
    getBundles(regex.css).map(function (bundle) {
        pump([
            src(bundle.inputFiles, { base: "." }),
            replace('../webfonts/', '../fonts/font-awesome/webfonts/'),
            concat(bundle.outputFileName),
            cssmin(),
            dest('assets/css/', {sourcemaps: '.'}),
            livereload()
        ], handleError(done));
    });
}

function js(done) {
    getBundles(regex.js).map(function (bundle) {
        pump([
            src(bundle.inputFiles, { base: "." }),
            sourcemaps.init(),
            concat(bundle.outputFileName),
            uglify(),
            sourcemaps.write(".", {addComment: false}),
            dest('assets/js/'),
            livereload()
        ], handleError(done));
    });
}


// Remove style.css file
task('clean', function(done) {
    del(['dist', 'assets/css/dark-theme.css', 'assets/css/style.css', 'assets/css/style.min.css', 'assets/css/bootstrap.css']);
    done();
});

// Copy third party libraries from node_modules into assets/js
task('assets:js', function(done) {
    src([
        './node_modules/bootstrap/dist/js/bootstrap.min.js',
        './node_modules/bootstrap/dist/js/bootstrap.min.js.map',
        './node_modules/@popperjs/core/dist/umd/popper.min.js',
        './node_modules/@popperjs/core/dist/umd/popper.min.js.map',
    ])
    .pipe(dest('./assets/js'))
    .on('end', done);
});

// Copy Bootstrap SCSS(SASS) from node_modules to vendor/bootstrap
task('bootstrap:scss', function(done) {
    src(['./node_modules/bootstrap/scss/**'])
        .pipe(dest('./vendor/bootstrap/scss'))
        .on('end', done);
});

// Compile SCSS(SASS) style file
task('scss:compile', function (done) {
    src(['./assets/scss/bootstrap.scss', './assets/scss/style.scss', './assets/scss/dark-theme.scss'])
        .pipe(sass.sync({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(dest('./assets/css'))
        .on('end', done);
});

const clean = task('clean');
const update = series(task('bootstrap:scss'), task('assets:js'));
const compile = series(task('scss:compile'), css);
const cssWatcher = () => watch(['assets/scss/**'], compile);
const jsWatcher = () => watch(['assets/js/**', '!assets/js/main.min.js', '!assets/js/main.min.js.map', '!assets/js/main2.min.js', '!assets/js/main2.min.js.map'], js);
const hbsWatcher = () => watch(['*.hbs', '**/**/*.hbs', '!node_modules/**/*.hbs'], hbs);
const watcher = parallel(cssWatcher, jsWatcher, hbsWatcher);
const build = series(compile, js);

exports.clean = clean;
exports.update = update;
exports.compile = compile;
exports.watch = watcher;
exports.build = build;