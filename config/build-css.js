const fs = require("fs");
const path = require("path");

const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
const clean = require("postcss-clean")();

const cssFiles = fs.readdirSync(path.resolve(__dirname, "../css"));
const bundlePath = path.resolve(__dirname, "../dist", "flicking-plugins.css");
const bundleMinPath = path.resolve(__dirname, "../dist", "flicking-plugins.min.css");

fs.rmSync(bundlePath, { force: true });
fs.rmSync(bundleMinPath, { force: true });

cssFiles.forEach(file => {
  const cssPath = path.resolve(__dirname, "../css", file);
  const destPath = path.resolve(__dirname, "../dist", file);
  const fileParsed = path.parse(file);
  const destMinPath = path.resolve(__dirname, "../dist", `${fileParsed.name}.min${fileParsed.ext}`);
  const css = fs.readFileSync(cssPath);

  postcss([autoprefixer])
    .process(css, { from: cssPath, to: destPath })
    .then(res => {
      fs.writeFileSync(destPath, res.css);
      fs.appendFileSync(bundlePath, res.css);
    });

  postcss([autoprefixer, clean])
    .process(css, { from: cssPath, to: destMinPath })
    .then(res => {
      fs.writeFileSync(destMinPath, res.css);
      fs.appendFileSync(bundleMinPath, res.css);
    });
});

// Bundle

// fs.readFile("src/app.css", (err, css) => {
//   postcss([precss, autoprefixer])
//     .process(css, { from: "src/app.css", to: "dest/app.css" })
//     .then(result => {
//       fs.writeFile("dest/app.css", result.css, () => true)
//       if ( result.map ) {
//         fs.writeFile("dest/app.css.map", result.map.toString(), () => true)
//       }
//     })
// })
