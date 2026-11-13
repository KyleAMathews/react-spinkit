import js from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import oracles from '@tanstack/eslint-plugin-oracles';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  {
    ignores: ['dist/', 'www/dist/', 'coverage/'],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    ...eslintReact.configs['recommended-typescript'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ['scripts/**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['*.{mjs,mts}', 'www/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  // Oracle files (test/**/*.oracle.*) and the probe form in src/**.
  oracles.configs.recommended,
  oracles.configs.production,
);
