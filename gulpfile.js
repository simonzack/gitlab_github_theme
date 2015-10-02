/*jshint -W079*/
var FirefoxProfile = require('firefox-profile');
var gulp = require('gulp');
var addsrc = require('gulp-add-src');
var concat = require('gulp-continuous-concat');
var webpack = require('webpack-stream');
var path = require('path');

function build(){
  var fileName = 'gitlab_github_theme.user.js';
  return gulp.src('gitlab_github_theme/main.js')
    .pipe(webpack({
      resolve: {root: ['.']},
      module: {
        loaders: [{
          test: /\.js$/,
          exclude: /[\\/]node_modules[\\/]/,
          loader: 'babel?blacklist[]=es6.forOf&blacklist[]=es6.arrowFunctions&blacklist[]=es6.blockScoping&blacklist[]=regenerator'
        }, {
          test: /\.css$/,
          loader: 'css?minimize'
        }, {
          test: /\.jade$/,
          loader: 'jade'
        }]
      },
      watch: true,
      output: {filename: fileName},
    }))
    .pipe(addsrc('gitlab_github_theme/header.js'))
    .pipe(concat(fileName));
}

gulp.task('build', function(){
  build().pipe(gulp.dest('dist'));
});

gulp.task('greasemonkey', function(){
  new FirefoxProfile.Finder().getPath('default', function(err, profilePath){
      build().pipe(gulp.dest(path.join(profilePath, 'gm_scripts/gitlab_github_theme')));
  });
});

gulp.task('default', ['greasemonkey']);
