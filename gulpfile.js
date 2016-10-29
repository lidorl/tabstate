const gulp = require('gulp')
const zip = require('gulp-zip');
const uglify = require('gulp-uglify');
const pump = require('pump');

gulp.task('default', () =>{
  console.log("gulp running");
})

gulp.task('prod', () => {
  pump([
    gulp.src('./frontend/*'),
    //uglify(),
    gulp.dest('./prod/src')
  ])
})

gulp.task('zip', () => {
  return pump([
    gulp.src('./prod/src'),
    zip('tabstate.zip'),
    gulp.dest('./prod')
  ])
})
