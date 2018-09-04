process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
    config.set({
      frameworks: ["mocha", "chai", "karma-typescript"],
      files: ["src/**/*.ts"],
      preprocessors: { "src/**/*.ts": "karma-typescript" },
      reporters: ["progress", "karma-typescript", "coverage"],
      port: 9876,  // karma web server port
      colors: true,
      logLevel: config.LOG_INFO,
      browsers: ["ChromeHeadlessNoSandbox"],
      customLaunchers: {
        ChromeHeadlessNoSandbox: {
          base: "ChromeHeadless",
          flags: ["--no-sandbox"]
        }
      },
      autoWatch: false,
      // singleRun: false, // Karma captures browsers, runs the tests and exits
      concurrency: Infinity,
      karmaTypescriptConfig: {
          compilerOptions: {
            target: "es5",
            module: "commonjs",
            lib: [ "es2015", "dom" ],
            strict: true,
            noUnusedLocals: true,
            noUnusedParameters: true,
            noImplicitReturns: true,
            noFallthroughCasesInSwitch: true,
            moduleResolution: "node",
            esModuleInterop: true,
            sourceMap: true
        },
        reports: {
          "lcovonly": "./coverage/lcov.info",
          "text": null,
        }
      }
    });
  };
