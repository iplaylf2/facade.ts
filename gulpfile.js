const { task, src, dest, parallel, series } = require("gulp");
const fs = require("fs");
const ts = require("gulp-typescript");
const sm = require("gulp-sourcemaps");

const package = "package";
const project = ts.createProject("tsconfig.json");
const code_dist = project.config.compilerOptions.outDir;
const attached = ["LICENSE", "README.md"];

function mkdir(name, cb) {
  fs.access(name, fs.constants.F_OK, (err) => {
    if (err) {
      fs.mkdir(name, cb);
    } else {
      cb();
    }
  });
}

function mkdirDist(cb) {
  mkdir(code_dist, cb);
}

function cleanDir(name, cb) {
  fs.rm(name, { recursive: true }, cb);
}

function cleanCodeDist(cb) {
  cleanDir(code_dist, cb);
}

function compile() {
  return project
    .src()
    .pipe(sm.init())
    .pipe(project())
    .pipe(sm.write("."))
    .pipe(dest(code_dist));
}

function copyConfig() {
  return src("package.json").pipe(dest(code_dist));
}

task("build", series(mkdirDist, cleanCodeDist, compile, copyConfig));

function mkdirPackage(cb) {
  mkdir(package, cb);
}

function cleanPackage(cb) {
  cleanDir(package, cb);
}

function dumpLibrary() {
  return src(`${code_dist}/**/*`).pipe(dest(package));
}

function fillPackage() {
  return src(attached).pipe(dest(package));
}

task(
  "pack",
  series(
    mkdirPackage,
    cleanPackage,
    parallel(series(task("build"), dumpLibrary), fillPackage)
  )
);
