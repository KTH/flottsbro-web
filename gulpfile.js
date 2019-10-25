"use strict";
const gulp = require("gulp");
const mergeStream = require("merge-stream");

const globals = {
  dirname: __dirname
};

const {
  moveResources,
  sass,
  vendor,
  clean
} = require("kth-node-build-commons").tasks(globals);
const { moveHandlebarPages } = require("kth-node-web-common/gulp");

gulp.task("vendor", vendor);
gulp.task("moveHandlebarPages", moveHandlebarPages);
gulp.task("clean", clean);
gulp.task("sass", sass);

// *** JavaScript helper tasks ***
gulp.task("moveResources", function() {
  return mergeStream(
    moveResources.moveKthStyle(),
    moveResources.moveBootstrap(),
    moveResources.moveFontAwesome()
  );
});

gulp.task("moveImages", function() {
  // Move project image files
  return gulp.src("./public/img/**/*").pipe(gulp.dest("dist/img"));
});

/**
 * Usage:
 *
 *  One-time build of browser dependencies for development
 *  $ gulp build [--production | --development]
 *
 *  Continuous re-build during development
 *  $ gulp watch
 */

gulp.task(
  "build",
  gulp.series(
    gulp.parallel(
      "moveHandlebarPages",
      "moveResources",
      "moveImages",
      "vendor"
    ),
    sass
  )
);

gulp.task("watchFiles", done => {
  gulp.watch(["./public/img/**/*.*"], gulp.parallel("moveImages"));
  gulp.watch(["./public/js/vendor.js"], gulp.parallel("vendor"));
  gulp.watch(["./public/css/**/*.scss"], gulp.parallel("sass"));
  done();
});

gulp.task("watch", gulp.series("build", "watchFiles"));
