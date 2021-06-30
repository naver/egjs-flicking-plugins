const buildHelper = require("@egjs/build-helper");
const external = {
	"@egjs/flicking": "Flicking"
}
const name = "Flicking.Plugins";

export default buildHelper([
  {
    name,
    input: "./src/index.ts",
    output: "./dist/plugins.js",
    format: "umd",
    external,
    exports: "named"
  }
]);

