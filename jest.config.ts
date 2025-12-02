import type { Config } from "jest";

const config: Config = {
  // Use ts-jest preset for TypeScript projects
  preset: "ts-jest",

  // Specify the test environment (e.g., 'node' for pure logic, 'jsdom' for UI)
  testEnvironment: "node",

  // Specify the file extensions Jest should look for
  moduleFileExtensions: ["js", "ts", "json"],

  // The test path pattern Jest uses to find test files
  testMatch: ["<rootDir>/**/*.test.ts"],

  // Transform files with ts-jest
  transform: {
    "^.+\\.ts$": "ts-jest",
  },

  // This setting maps imports in the tests (like './price_calculator')
  // to their actual source files.
  moduleNameMapper: {
    "^./price_calculator$": "<rootDir>/price_calculator.ts",
  },
};

export default config;
