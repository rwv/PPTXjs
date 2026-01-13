import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
export default defineConfig(
  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '*.js',
    ],
  },

  // Base ESLint + TypeScript-ESLint recommended rules
  eslint.configs.recommended,
  tseslint.configs.recommended,

  // Prettier compatibility - must be last
  prettierConfig,
);
