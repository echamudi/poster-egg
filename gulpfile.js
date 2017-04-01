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
const gulp = require('gulp');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const gutil = require("gulp-util");
const exit = require("gulp-exit");
const connect = require("gulp-connect");
const del = require('del');
const run = require('gulp-run');
const yargs = require('yargs');
const copy = require('gulp-copy');
const debug = require('gulp-debug');

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

const minify = false; // True : Enable minify an all files
const maps = true; // True : Create source maps
const argv = yargs.argv;

// Prevents task to stop being watched on error
function swallowError(error) {
    gutil.log(error)
    this.emit('end')
}

// writeFile

function writeFile(filepath, contents, cb) {
  mkdirp(path.dirname(filepath), function (err) {
    if (err) return cb(err);

    fs.writeFile(filepath, contents, function(err) {
                            if(err) {
                                return console.log(err);
                            }
                        });
  });
}


/**
 * ------------------------------------------------------------------------
 * App tasks
 * ------------------------------------------------------------------------
 */

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

gulp.task('design-assets', () => {
    return gulp
        .src([ 'src/data/design-assets/**/*'])
        .pipe(copy('dist/', {prefix: 1}))
});

gulp.task('all-designs-json', () => {
    
    var mainDir = 'src/data/design-packs/';

    var finalDesignList = [];

    // List all folders to get groupNames
    fs.readdir(mainDir, (err, groupNames) => {

        // Read each group name and push processed data to finalDesignList
        groupNames.forEach((groupName) => {

            // read _data.json file in the group
            var groupData = JSON.parse(fs.readFileSync(mainDir + groupName + '/_data.json'));

            // add folder name as ID
            groupData.groupID = groupName;

            // shift by -1 to fit array key
            var groupOrder = groupData.order - 1;

            // "order" property is not important now
            delete groupData.order;

            // add current group data to final design list
            finalDesignList[groupOrder] = groupData;

            // design list property
            finalDesignList[groupOrder].designs = [];

            // look for the designs themselves, read all files inside the group folder
            fs.readdir(mainDir + '/' + groupName, (err, groupContents) => {

                groupContents.forEach((fileName) => {

                    // only *.template.json
                    if(fileName.endsWith(".template.json")) {

                        // read *.template.json
                        var designData = JSON.parse(fs.readFileSync(mainDir + groupName + '/' + fileName));
                        
                        // add json file name
                        designData.designID = fileName.replace(/.template.json/g,'');

                        // shift by -1 to fit array key
                        var designOrder = designData.order - 1;

                        // "order" property is not important now
                        delete designData.order;

                        writeFile("dist/data/design-packs/" + groupName + '/' + fileName, JSON.stringify(designData));

                        // "designProperties" property is not required
                        delete designData.designProperties;
                        
                        finalDesignList[groupOrder].designs[designOrder] = designData;
                    }
                })

                // write it

                writeFile("dist/data/all-designs.json", JSON.stringify(finalDesignList));
            });
        });
    });
});

gulp.task('clean-data', () => {
    return del([
        'dist/data'
    ]);
});

/**
 * ------------------------------------------------------------------------
 * Other tasks
 * ------------------------------------------------------------------------
 */

gulp.task('connect', () => {
    connect.server({
        root: ['dist'],
        fallback: 'dist/index.html',
        https: false
    })
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
        .pipe(gulp.dest('src/app'))
        ;
});

/**
 * ------------------------------------------------------------------------
 * Executor
 * ------------------------------------------------------------------------
 * $ gulp build : Build once
 * $ gulp       : Build and watch
 */


gulp.task('build', ['clean'], () => {
    gulp.start('pug');
    gulp.start('sass');
    gulp.start('design-assets');
    gulp.start('all-designs-json');
    bundle(normalBrowserify);
});

gulp.task('default', ['clean'], () => {

    // Initial Executes
    gulp.start('pug');
    gulp.start('sass');
    gulp.start('design-assets');
    gulp.start('all-designs-json');
    bundle(watchedBrowserify);

    // Enable Watches
    watchedBrowserify.on('update', () => bundle(watchedBrowserify));
    gulp.watch('src/**/*.pug', ['pug']);
    gulp.watch('src/**/*.scss', ['sass']);
    gulp.watch('src/data/design-packs/**/*.json', ['all-designs-json']);

    // Connect
    gulp.start('connect');
});

