const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@components/(.*)$": "<rootDir>/app/components/$1",
    "^@pages/(.*)$": "<rootDir>/pages/$1",
    "^@services/(.*)$": "<rootDir>./app/services/$1",
  },
  testEnvironment: "jest-environment-jsdom",

  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/app/services/",
  ],
};

(module.exports = createJestConfig(customJestConfig)),
  {
    setupFiles: ["dotenv/config"],
    verbose: false,
  };
