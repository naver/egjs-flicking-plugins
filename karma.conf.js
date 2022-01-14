module.exports = function(config) {
  const karmaConfig = {
    frameworks: ["mocha", "chai", "sinon", "karma-typescript", "viewport"],
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    client: {
      mocha: {
        opts: "./mocha.opts",
      },
    },
    files: [
      "./node_modules/hammer-simulator/index.js",
      "./test/hammer-simulator.run.js",
      "./test/setup.js",
      "./src/**/*.ts",
      "./test/**/*.ts",
    ],
    preprocessors: {
      "src/**/*.ts": ["karma-typescript"],
      "test/**/*.ts": ["karma-typescript"],
    },
    karmaTypescriptConfig: {
      tsconfig: "./tsconfig.test.json",
      reports: {
        html: {
          "directory": "coverage",
          "subdirectory": "./"
        },
        lcovonly: {
          "directory": "coverage",
          "filename": "lcov.info",
          "subdirectory": "."
        },
      },
      coverageOptions: {
        instrumentation: true,
        exclude: /test/i,
      }
    },
    browsers: [],
    customLaunchers: {
      CustomChromeHeadless: {
        base: "ChromeHeadless",
        flags: ["--window-size=1600,900", "--no-sandbox", "--disable-setuid-sandbox"],
      },
    },
    reporters: ["mocha"],
    proxies: {
      "/images/": "/base/test/unit/images/"
    },
  };

  karmaConfig.browsers.push(config.chrome ? "Chrome" : "CustomChromeHeadless");

  if (config.coverage) {
    karmaConfig.reporters.push("karma-typescript");
    karmaConfig.singleRun = true;
  }

  config.set(karmaConfig);
};
