module.exports = {
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/tests/**/*.jest.test.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup-jest.js"],
  moduleFileExtensions: ["js", "mjs", "cjs", "json"]
};
