import type {Config} from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.ts',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.ts',
    '^../../components/movieReviews/movieReviews\\.component$': '<rootDir>/src/__mocks__/movieReviews.component.tsx'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
};

export default config;
