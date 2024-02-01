import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["./jest.setup.js"],
  moduleNameMapper: {
    "\\.(css)$": "identity-obj-proxy",
    "\\.(png)$": "identity-obj-proxy",
    "\\.(svg)$": "identity-obj-proxy",
    "^Kushki$": "<rootDir>/src/module/Card.ts",
    "^Kushki/card$": "<rootDir>/src/module/card/Card.ts"
  },
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  coverageDirectory: "./coverage",
  coveragePathIgnorePatterns: [
    "src/showcase/App.tsx",
    "src/module/gateway/KushkiGateway.ts"
  ]
};

export default config;
