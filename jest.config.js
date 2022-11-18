module.exports = {
  testEnvironment: 'node',
  testRegex: 'test/.*(unittest|mocktest|test|spec)\\.ts$',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [],
  setupFilesAfterEnv: [], // extensions go here
  testMatch: null,
  preset: 'ts-jest',
};
