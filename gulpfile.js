"use strict";

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-terser"),
    merge = require("merge-stream"),
    replace = require("gulp-replace"),
    sourcemaps = require("gulp-sourcemaps"),
    bundleconfig = require("./bundleconfig.json");
    
    var regex = {
        css: /\.css$/,
        js: /\.js$/
    };

    function getBundles(regexPattern) {
        return bundleconfig.filter(function (bundle) {
            return regexPattern.test(bundle.outputFileName);
        });
    }

    gulp.task("min:js", function () {
        var tasks = getBundles(regex.js).map(function (bundle) {
            return gulp.src(bundle.inputFiles, { base: "." })
                .pipe(sourcemaps.init())
                .pipe(concat(bundle.outputFileName))
                .pipe(uglify())
                .pipe(sourcemaps.write(".", {addComment: false}))
                .pipe(gulp.dest("."));
        });
        return merge(tasks);
    });
    
    gulp.task("min:css", function () {
        var tasks = getBundles(regex.css).map(function (bundle) {
            return gulp.src(bundle.inputFiles, { base: "." })
                .pipe(replace('../webfonts/', '../fonts/font-awesome/webfonts/'))
                .pipe(concat(bundle.outputFileName))
                .pipe(cssmin())
                .pipe(gulp.dest("."));
        });
        return merge(tasks);
    });

    gulp.task("min", gulp.series(["min:js", "min:css"]));