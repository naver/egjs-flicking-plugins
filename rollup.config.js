
// flicking.js
// flicking.min.js
// flicking.pkgd.js
// flicking.pkgd.min.js
// flicking.esm.js


const {esm, umds} = require("./config/bundler");


export default [
  esm({
		input: "./src/index.ts",
		output: "./dist/plugins.esm.js",
  }),
  ...umds({
		input: "./src/index.ts",
		outputs: [
			`./dist/plugins.js`,
			`./dist/plugins.min.js`,
		],
		exports: "named",
		library: "eg.Flicking.plugins",
	}),
];
