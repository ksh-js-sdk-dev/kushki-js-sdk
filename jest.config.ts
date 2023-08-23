import type {Config} from 'jest';

const config: Config= {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["./jest.setup.js"],
  moduleNameMapper: {
    "\\.(css)$": "identity-obj-proxy",
    "\\.(png)$": "identity-obj-proxy",
    "\\.(svg)$": "identity-obj-proxy",
    "KFields": "<rootDir>/src/module/index.ts",
  },
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  coverageDirectory: "./coverage"
};

export default config;

