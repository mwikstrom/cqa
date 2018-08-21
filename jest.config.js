module.exports = {
    testURL: "http://localhost/",
    transform: {
      "^.+\\.tsx?$": "ts-jest"
    },
    testRegex: "/src/.*\\.spec\\.ts$",
    moduleFileExtensions: [
      "ts",
      "tsx",
      "js",
      "jsx",
      "json",
      "node"
    ],
    collectCoverageFrom: [
      "src/**/*.ts",
      "!src/test-helpers/**",
      "!src/**/*.spec.ts"
    ]
}
