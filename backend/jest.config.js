/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  testTimeout: 60000,   // allow in-memory MongoDB to start (binary download on first run)
  forceExit: true,      // shut down any lingering handles (Socket.IO, mongoose) after all tests
};
