module.exports = {
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/tests/**/*.jest.test.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup-jest.js"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleFileExtensions: ["ts", "tsx", "js", "mjs", "cjs", "json"]
};
