import { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  testRegex: 'test/.*(unittest|mocktest|test|spec)\\.ts$',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [],
  setupFilesAfterEnv: ['./test/setup.ts'], // extensions go here
  preset: 'ts-jest',
};

export default config;
