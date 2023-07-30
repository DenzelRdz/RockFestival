const { src, dest, watch, parallel } = require("gulp");

// CSS
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");
const autoPrefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");

// Javascript
const terser = require("gulp-terser-js");

// Imagenes
const cache = require("gulp-cache");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");

function css(done) {
  src("src/scss/**/*.scss") // Identificar el archivo de sass
    .pipe(sourcemaps.init())
    .pipe(plumber()) // Evitar que se detenga el proceso
    .pipe(sass()) // Compilarlo
    .pipe(postcss([autoPrefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("build/css")); // Almacenarla en el disco duro

  done();
}

function imagenes(done) {
  const opciones = {
    optimizationLevel: 3,
  };
  src("src/img/**/*.{png, jpg}") // Identificar las imagenes
    .pipe(cache(imagemin(opciones))) // Aligerar las imagenes
    .pipe(dest("build/img")); // Almacenar las imagenes
  done();
}

function versionWebp(done) {
  const opciones = {
    quality: 50,
  };
  src("src/img/**/*.{jpg, png}") // Identificar las imagenes
    .pipe(webp(opciones)) // Convertirlas
    .pipe(dest("build/img")); // Almacenarlas

  done();
}

function versionAvif(done) {
  const opciones = {
    quality: 50,
  };
  src("src/img/**/*.{jpg, png}") // Identificar las imagenes
    .pipe(avif(opciones)) // Convertirlas
    .pipe(dest("build/img")); // Almacenarlas

  done();
}

function javascript(done) {
  src("src/js/**/*.js") // Identificar archivo js
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write("."))
    .pipe(dest("build/js")); // Almacenar archivo js
  done();
}

function dev(done) {
  watch("src/scss/**/*.scss", css);
  watch("src/js/**/*.js", javascript);
  done();
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);
