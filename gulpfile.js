"use strict";

const {series, watch, src, dest, parallel} = require('gulp');
const pump = require('pump');

// gulp plugins and utils
var livereload = require('gulp-livereload');
var uglify = require('gulp-terser');
var beeper = require('beeper');
var concat = require("gulp-concat");
var cssmin = require("gulp-cssmin");
var merge = require("merge-stream");
var replace = require("gulp-replace");
var sourcemaps = require("gulp-sourcemaps");
var bundleconfig = require("./bundleconfig.json");

var regex = {
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
            beeper();
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
            sourcemaps.write(".", {addComment: true}),
            dest('assets/js/'),
            livereload()
        ], handleError(done));
    });
}

const cssWatcher = () => watch(['assets/css/**', '!assets/css/style.min.css'], css);
const jsWatcher = () => watch(['assets/js/**', '!assets/js/main.min.js', '!assets/js/main.min.js.map'], js);
const hbsWatcher = () => watch(['*.hbs', '**/**/*.hbs', '!node_modules/**/*.hbs'], hbs);
const watcher = parallel(cssWatcher, jsWatcher, hbsWatcher);
const build = series(css, js);
const dev = series(build, serve, watcher);

exports.build = build;
exports.default = dev;