import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  collectCoverageFrom: ['src'],
};

export default jestConfig;
