/**
 * Created by twang on 2015/2/16.
 */
'use strict';
var path = require('path');
var del = require('del');
var stylus = require('stylus');
var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var through = require('through2');
var sourcemaps = require('gulp-sourcemaps');
var crypto = require('crypto');
var taskListing = require('gulp-task-listing');
var browserifyInc = require('browserify-incremental');
var babelify = require("babelify");
var jadeify = require('jadeify');
var uglify = require('gulp-uglify');
var fsCache = require('gulp-fs-cache');

initCrmJsTasks();

function initCrmJsTasks() {
  var jsConfig = require('../jade-project/public/js/config');
  var JSSrc = '../jade-project/public/js';
  var JSDest = '../jade-project/public/js/compressed';
  initJsTasks(jsConfig, JSSrc, JSDest);
}

function initJsTasks(jsConfig, JSSrc, JSDest) {
  //一次任务 移动styl文件到stylus文件夹
  gulp.task('html', ()=>{
    gulp.src('public/css/*.styl')
      .pipe(gulp.dest('public/stylus'));
  });

  // TODO 目前未测成功
  gulp.task('stylus-compress', function(){
    gulp.src('public/css/*.styl')
      .pipe(stylus())
      .pipe(rename(function (path) {
        path.basename += '.min';
      }))
      .pipe(gulp.dest('public/css/compress'));
  });

  gulp.task('clean.js', function (cb) {
    del(JSDest + '/**/*', cb);
  });

  gulp.task('copy.js', function () {
    var tasks = [];
    var copied = {};
    for (var viewName in jsConfig) {
      if (jsConfig.hasOwnProperty(viewName)) {
        var scriptsMap = jsConfig[viewName];
        for (var destScriptName in scriptsMap) {
          if (scriptsMap.hasOwnProperty(destScriptName)) {
            var srcScripts = scriptsMap[destScriptName];
            if (typeof srcScripts === 'string' && !copied[destScriptName]) {
              var srcPath = path.join(JSSrc, srcScripts + '.js');
              var destPath = path.join(JSDest, destScriptName + '.js');
              tasks.push(gulp.src(srcPath)
                .pipe(rename({basename: destScriptName}))
                .pipe(gulp.dest(JSDest)));
              copied[destScriptName] = 1;
              gutil.log('copy \'' + srcPath + '\' to \'' + destPath + '\'.');
            }
          }
        }
      }
    }
    return merge(tasks);
  });

  gulp.task('concat.js', function () {
    var tasks = [];
    for (var viewName in jsConfig) {
      if (jsConfig.hasOwnProperty(viewName)) {
        var scriptsMap = jsConfig[viewName];
        for (var destScriptName in scriptsMap) {
          if (scriptsMap.hasOwnProperty(destScriptName)) {
            var srcScripts = scriptsMap[destScriptName];
            if (Array.isArray(srcScripts) && srcScripts.length) {
              var destPath = path.join(JSDest, destScriptName + '.js');
              tasks.push(gulp.src(srcScripts.map(function (srcScript) {
                return path.join(JSSrc, srcScript + '.js');
              }))
                .pipe(concat(destScriptName + '.js'))
                .pipe(gulp.dest(JSDest)));
              gutil.log('concat \'' + destPath + '\'.');
            }
          }
        }
      }
    }
    return merge(tasks);
  });

  gulp.task('browserify.js', function () {
    var tasks = [];
    for (var viewName in jsConfig) {
      if (jsConfig.hasOwnProperty(viewName)) {
        var scriptsMap = jsConfig[viewName];
        for (var destScriptName in scriptsMap) {
          if (scriptsMap.hasOwnProperty(destScriptName)) {
            var srcScripts = scriptsMap[destScriptName];
            if (typeof srcScripts === 'object') {
              var bSrcScripts = srcScripts['browserify'];
              if (Array.isArray(bSrcScripts)) {
                var destPath = path.join(JSDest, destScriptName + '.js');

                var b = browserify(
                  bSrcScripts.map(function(srcScript) {
                    return JSSrc + '/' + srcScript + '.js';
                  }),
                  { cache: {}, packageCache: {}, debug: true }
                )
                  .transform(jadeify)
                  .transform(babelify, { presets: ['es2015', 'stage-2'], sourceMaps: true });

                var jsFsCache = fsCache('./cache/js-cache');

                browserifyInc(b, {cacheFile: './cache/browserify-cache-' + destScriptName + '.json'});
                tasks.push(b
                  .bundle()
                  .on('error', gutil.log.bind(gutil, 'Browserify error'))
                  .pipe(source(destScriptName + '.js'))
                  .pipe(buffer())
                  .pipe(sourcemaps.init({loadMaps: true}))
                  .pipe(jsFsCache)
                  .pipe(uglify())
                  .on('error', gutil.log.bind(gutil, 'uglify error'))
                  .pipe(jsFsCache.restore)
                  .pipe(sourcemaps.write('.'))
                  .pipe(gulp.dest(JSDest))
                  .on('end', gutil.log.bind(gutil, 'browserify \'' + destPath + '\'.')));
              }
            }
          }
        }
      }
    }
    return merge(tasks);
    });

  gulp.task('watchify.js', function () {
    function watch(files, dest) {
      var b = watchify(browserify(files, {debug: true, cache: {}, packageCache: {}, fullPaths: true}))
        .transform(jadeify);
      var destPath = path.join(JSDest, dest);

      function bundle() {
        return b.bundle()
          .on('error', gutil.log.bind(gutil, 'Browserify Error'))
          .pipe(source(dest))
          .pipe(gulp.dest(JSDest))
          .on('end', gutil.log.bind(gutil, 'browserify \'' + destPath + '\'.'));
      }

      b.on('update', bundle);
      b.on('log', gutil.log);
      return bundle();
    }

    var tasks = [];
    for (var viewName in jsConfig) {
      if (jsConfig.hasOwnProperty(viewName)) {
        var scriptsMap = jsConfig[viewName];
        for (var destScriptName in scriptsMap) {
          if (scriptsMap.hasOwnProperty(destScriptName)) {
            var srcScripts = scriptsMap[destScriptName];
            if (typeof srcScripts === 'object') {
              var bSrcScripts = srcScripts['browserify'];
              if (Array.isArray(bSrcScripts)) {
                tasks.push(watch(bSrcScripts.map(function (srcScript) {
                  return JSSrc + '/' + srcScript + '.js';
                }), destScriptName + '.js'));
              }
            }
          }
        }
      }
    }
    return merge(tasks);
  });

  function calculateJsHash() {
    gulp.src(JSDest + "/*.js")
      .pipe((function () {
        var fileContent = {};
        return through.obj(function (file, enc, cb) {
          if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-debug', 'Streaming not supported'));
            return cb();
          }
          var md5Hash = crypto.createHash('md5').update(file.contents, 'utf8').digest('hex');
          var fileName = path.basename(file.path, '.js');
          fileContent[fileName] = md5Hash;
          cb();
        }, function (cb) {
          var hashFile = new gutil.File({
            path: 'hash.json'
          });
          hashFile.contents = new Buffer(JSON.stringify(fileContent, null, '  '));
          this.push(hashFile);
          cb();
        });
      })())
      .pipe(gulp.dest(JSDest));
  }

  gulp.task('build.js', ['copy.js', 'concat.js', 'browserify.js'], calculateJsHash);

  gulp.task('build.js.dev', ['copy.js', 'concat.js', 'watchify.js'], calculateJsHash);
}

