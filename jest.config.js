'use strict';

module.exports = {
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  testRegex: "src\\/.*\\/__tests__\\/.*\\.test\\.tsx?$",
  moduleFileExtensions: ['ts', 'js', 'json'],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
      diagnostics: false,
    }
  },
};
