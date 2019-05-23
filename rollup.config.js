const buildHelper = require("@egjs/build-helper");
const external = {
	"@egjs/flicking": "eg.Flicking",
}
const name = "eg.Flicking.plugins";

export default buildHelper([
		{
      name,
			input: "./src/index.ts",
      output: "./dist/plugins.js",
      format: "umd",
			external,
			exports: "named",
    },
    {
      name,
			input: "./src/index.ts",
      output: "./dist/plugins.min.js",
      format: "umd",
      uglify: true,
			external,
			exports: "named",
    },
    {
      input: "./src/index.ts",
      output: "./dist/plugins.esm.js",
      format: "esm",
      external,
      exports: "named",
    },
]);

