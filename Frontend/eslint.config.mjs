import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['projects/**/*', '**/*.html'],
  },
  ...compat
    .extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier'
    )
    .map((config) => ({
      ...config,
      files: ['**/*.ts'],
    })),
  {
    files: ['**/*.ts'],

    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        project: ['tsconfig.json', 'e2e/tsconfig.e2e.json'],
        createDefaultProgram: true,
      },
    },

    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'function-call-argument-newline': ['error', 'consistent'],
      'array-bracket-newline': 'off',
      'no-prototype-builtins': 'error',
      'prefer-arrow-callback': 'error',
      'no-duplicate-imports': 'error',
      'no-self-compare': 'error',
      'no-unused-private-class-members': 'error',
      'default-case': 'error',
      'default-param-last': 'error',
      'object-curly-spacing': ['error', 'always'],

      'arrow-spacing': [
        'error',
        {
          before: true,
          after: true,
        },
      ],

      'comma-spacing': [
        'error',
        {
          before: false,
          after: true,
        },
      ],

      'no-trailing-spaces': 'error',
      'no-multi-spaces': 'error',
      'space-in-parens': ['error', 'never'],
      semi: ['error', 'always'],
    },
  },
  ...compat.extends('plugin:prettier/recommended').map((config) => ({
    ...config,
    files: ['**/*.html'],
  })),
  {
    files: ['**/*.html'],
    rules: {},
  },
  ...compat.extends('plugin:prettier/recommended').map((config) => ({
    ...config,
    files: ['**/*.html'],
    ignores: ['**/*inline-template-*.component.html'],
  })),
  {
    files: ['**/*.html'],
    ignores: ['**/*inline-template-*.component.html'],

    rules: {
      'prettier/prettier': [
        'error',
        {
          parser: 'angular',
        },
      ],
    },
  },
];
