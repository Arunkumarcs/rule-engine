/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  collectCoverage: true,
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],
  coverageReporters: ["lcov", "json-summary"],
};