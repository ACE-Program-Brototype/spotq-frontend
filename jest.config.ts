import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/config/env$": "<rootDir>/__mocks__/env.ts",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^ky$": "<rootDir>/__mocks__/ky.ts",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          module: "esnext",
          target: "es2022",
          moduleResolution: "node",
          allowSyntheticDefaultImports: true,
          esModuleInterop: true,
          skipLibCheck: true,
          types: ["node", "jest", "@testing-library/jest-dom", "vite/client"],
        },
      },
    ],
  },
};

export default config;
