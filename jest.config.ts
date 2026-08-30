import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    "^@/config/env$": "<rootDir>/__mocks__/env.ts",
    "^ky$": "<rootDir>/__mocks__/ky.ts",
    "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js",
    "\\.(gif|ttf|eot|svg|png|jpg|jpeg|avif|webp)$": "<rootDir>/__mocks__/fileMock.js",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "typescript",
            tsx: true,
          },
          transform: {
            optimizer: {
              globals: {
                vars: {
                  "import.meta.env": "{}",
                  "import.meta.env.VITE_API_BASE_URL": '"http://localhost:3000/api/v1"',
                },
              },
            },
            react: {
              runtime: "automatic",
            },
          },
        },
      },
    ],
  },
  transformIgnorePatterns: ["node_modules/(?!ky)/"],
};

export default config;
