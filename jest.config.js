module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["./jest.setup.js"],
  moduleNameMapper: {
    "\\.(css)$": "identity-obj-proxy",
    "\\.(png)$": "identity-obj-proxy",
    "\\.(svg)$": "identity-obj-proxy",
  },
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coverageDirectory: "./coverage",
};
