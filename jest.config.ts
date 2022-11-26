import { Config } from 'jest';
import './src/index';

const config: Config = {
  testEnvironment: 'node',
  testRegex: 'test/.*(unittest|mocktest|test|spec)\\.ts$',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [],
  setupFilesAfterEnv: ['./src/index.ts'], // extensions go here
  preset: 'ts-jest',
};

export default config;
