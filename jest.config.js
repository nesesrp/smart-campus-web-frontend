const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle module aliases
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/app/api/**',
    '!src/components/ui/**',
    '!src/mocks/**',
    '!src/services/api-client.js',
    '!src/schemas/**',
    '!src/components/layout/**',
    '!src/components/profile/**',
    '!src/**/*.d.ts',
    '!src/**/layout.{js,jsx}',
    '!src/app/layout.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
