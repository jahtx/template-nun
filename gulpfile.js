/*
inspired by
https://gist.github.com/DESIGNfromWITHIN/11383339
*/

const browserSync = require("browser-sync");
const cleancss = require("gulp-clean-css");
const concat = require("gulp-concat");
const gulp = require("gulp");
const gwatch = require("gulp-watch");
const neat = require("node-neat");
const notify = require("gulp-notify");
const nunjucksRender = require("gulp-nunjucks-render");
const plumber = require("gulp-plumber");
const reload = browserSync.reload;
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");

/* Sass task */
gulp.task("sass-task", () => {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(plumber())
    .pipe(
      sass({
        includePaths: ["scss"].concat(neat),
      })
    )
    .pipe(gulp.dest("./dist/css"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(cleancss())
    .pipe(gulp.dest("./dist/css"))
    .pipe(reload({ stream: true }));
});
/* Nunjucks task */

var nunjucksFolders = ["./src/pages/**/*.+(html|njk)", "./src/templates/*.njk"];

gulp.task("nunjucks-task", () => {
  gulp
    .src("./src/pages/**/*.+(html|njk)")
    .pipe(
      nunjucksRender({
        path: ["./src/templates"],
      })
    )
    .pipe(gulp.dest("./dist"))
    .pipe(reload({ stream: true }));
});

/* HTML, img, and file copy task using gulp-watch */
var gwatchFolders = [
  "./src/*.html",
  "./src/img/**/*",
  "./src/files/*",
  "./src/js/*",
];

gulp.task("gwatch-task", () => {
  gulp
    .src(gwatchFolders, { base: "./src" })
    .pipe(gwatch(gwatchFolders))
    .pipe(gulp.dest("./dist"))
    .pipe(reload({ stream: true }));
});

/* Reload task */
gulp.task("bs-reload", () => {
  browserSync.reload();
});

/* Prepare Browser-sync for localhost */
gulp.task("browser-sync", () => {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
    notify: false,
  });
});

gulp.task(
  "default",
  ["nunjucks-task", "sass-task", "gwatch-task", "browser-sync"],
  () => {
    gulp.watch("./src/scss/**/*.scss", ["sass-task"]);
    gulp.watch(["./src/js/**/*.js", "./src/js/index.js"]);
    gulp.watch([gwatchFolders], ["gwatch-task"]);
    gulp.watch([nunjucksFolders], ["nunjucks-task"]);
  }
);
