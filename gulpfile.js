'use strict';

/*
 * ------------------------------------------------------------------------
 * Requires
 * ------------------------------------------------------------------------
 */

// Node JS

const fs = require('fs');
const mkdirp = require('mkdirp');
var path = require('path');

// Gulps
const babel = require('gulp-babel');
const connect = require("gulp-connect");
const debug = require('gulp-debug');
const del = require('del');
const exit = require("gulp-exit");
const gulp = require('gulp');
const gulpif = require('gulp-if');
const gutil = require("gulp-util");
const pug = require('gulp-pug');
const run = require('gulp-run');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const yargs = require('yargs');

// Vinyl
const browserify = require("browserify");
const tsify = require("tsify");

const watchify = require("watchify");
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

// For Post-CSS
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

/**
 * ------------------------------------------------------------------------
 * Vars
 * ------------------------------------------------------------------------
 */

const argv = yargs.argv;
const hostPort = 60571;

let minify = false; // True : Enable minify on all files
let maps = true; // True : Create source maps

// Prevents task to stop being watched on error
function swallowError(error) {
    gutil.log(error)
    this.emit('end')
}

/**
 * ------------------------------------------------------------------------
 * App tasks
 * ------------------------------------------------------------------------
 */

// TODO: Fix tasks

const browserifyOptions = {
    basedir: '.',
    debug: maps,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
};

const tsifyOptions = require('./tsconfig').compilerOptions;

const normalBrowserify = browserify(browserifyOptions)
    .plugin(tsify, tsifyOptions);

const watchedBrowserify = watchify(browserify(browserifyOptions))
    .plugin(tsify, tsifyOptions);
watchedBrowserify.on('log', gutil.log);

// Browserify Functiom, use
const bundle = (toBundle) => {

    // Log "Starting 'Bundle Function'..." at the beginning
    gutil.log('Starting \'' + gutil.colors.cyan('Bundle Function') + ' 📦\'...');

    return toBundle

        .bundle()

        // Catch error
        .on('error', swallowError)

        // Start Pipe
        .pipe(source('bundle.js'))

        // Prepare maps
        .pipe(buffer())
        .pipe(gulpif(maps, sourcemaps.init({ loadMaps: true })))

        // Babel
        .pipe(gulpif(minify, babel({
            presets: ['@babel/env']
        })))

        // Uglify
        .pipe(gulpif(minify, uglify()))

        // Write maps
        .pipe(gulpif(maps, sourcemaps.write('./maps')))

        // Save
        .pipe(gulp.dest("dist"))

        // Log done at end
        .on('end', () => gutil.log('Finished \'' + gutil.colors.cyan('Bundle Function') + ' 📦\''))
}

gulp.task('pug', () => {
    const options = {
        pretty: !minify
    };

    return gulp.src('src/**/[^_]*.pug')
        .pipe(pug(options))
        .on('error', swallowError)
        .pipe(gulp.dest('dist'));
});

gulp.task('sass', () => {
    const options = {
        outputStyle: minify ? 'compressed' : 'nested'
    };

    const plugins = [
        autoprefixer({ browsers: ['chrome >= 36', 'firefox >= 45'] })
    ];

    return gulp.src('src/**/*.scss')

        // New sourcemaps, loading inline sourcemap from Sass' sourcemap.
        .pipe(gulpif(maps, sourcemaps.init()))

        // Compile SASS.
        .pipe(sass(options).on('error', sass.logError))

        // Run compiled CSS through autoprefixer.
        .pipe(postcss(plugins))

        // Write sourcemap to a separate file.        
        .pipe(gulpif(maps, sourcemaps.write('./maps')))

        // Write CSS file to desitination path.
        .pipe(gulp.dest('dist'));
});

gulp.task('i18n', () => {
    var sourceFiles = [ 'src/i18n/**/*'];
    var destination = 'dist/i18n/';
    
    return gulp
        .src(sourceFiles)
        .pipe(gulp.dest(destination));
});

gulp.task('assets', () => {
    var sourceFiles = [ 'src/assets/**/*'];
    var destination = 'dist/assets/';
    
    return gulp
        .src(sourceFiles)
        .pipe(gulp.dest(destination));
});

/**
 * ------------------------------------------------------------------------
 * Other tasks
 * ------------------------------------------------------------------------
 */

gulp.task('connect', (cb) => {
    connect.server({
        root: ['dist'],
        // fallback: 'dist/index.html', // Enable this if not using angular HashLocationStrategy
        port: hostPort,
        https: false
    });

    cb();
});

gulp.task('clean', () => {
    return del([
        'dist'
    ]);
});

/**
 * ------------------------------------------------------------------------
 * Terminal Tasks
 * ------------------------------------------------------------------------
 */

// New component
// $ gulp newcomp --name your-component
// Tested in mac, not sure in linux

gulp.task('newcomp', function () {
    var nameDashed = argv.name;
    var nameCapitalized = ("-" + nameDashed).replace(/-([a-z])/g, function (g) { return g[1].toUpperCase() });

    return gulp
        .src('src/app')
        .pipe(run('touch src/app/' + nameDashed + '.component.pug'))
        .pipe(run('touch src/app/' + nameDashed + '.component.scss'))
        .pipe(run('cp templates/new-component.component.ts.template src/app/' + nameDashed + '.component.ts'))
        .pipe(run("sed -i '' 's/compNameDashed/" + nameDashed + "/g' src/app/" + nameDashed + ".component.ts"))
        .pipe(run("sed -i '' 's/compNameCapitalized/" + nameCapitalized + "/g' src/app/" + nameDashed + ".component.ts"))
        .pipe(gulp.dest('src/app'));
});

/**
 * ------------------------------------------------------------------------
 * Executor
 * ------------------------------------------------------------------------
 * $ gulp build : Build once
 * $ gulp       : Build and watch
 */


gulp.task('build', gulp.series('clean', 'pug', 'sass', 'i18n', 'assets', (done) => {
    // gulp.series(
    //     'pug', 
    //     'sass', 
    //     'i18n', 
    //     'assets'
    //     );
    return bundle(normalBrowserify);
}));

gulp.task('build-prod', gulp.series('clean', (done) => {
    minify = true;
    maps = false;

    done();
    
}, 'build'));

gulp.task('default', gulp.series('clean', 

    // Initials
    'pug', 'sass', 'i18n', 'assets', 

    (cb) => {
        // bundle(watchedBrowserify);
        return bundle(watchedBrowserify);
    },

    'connect', 
    
    // More
    (cb) => {

        watchedBrowserify.on('update', () => bundle(watchedBrowserify))         
        gulp.watch('src/**/*.pug', gulp.series('pug'));
        gulp.watch('src/**/*.scss', gulp.series('sass'));
        gulp.watch('src/i18n/**/*.json', gulp.series('i18n'));
        gulp.watch('src/assets/**/*.*', gulp.series('assets'));

        cb();
    })
);