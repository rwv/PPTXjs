import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';

export default [
  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      'js/**',
      'js-original/**',
      'dist/**',
      '*.config.js',
      'src/js/utils/vendors/**', // Third-party code
    ],
  },

  // Base ESLint recommended rules
  eslint.configs.recommended,

  // TypeScript files configuration
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        // Browser globals
        globalThis: 'readonly',
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        location: 'readonly',
        alert: 'readonly',
        fetch: 'readonly',
        Blob: 'readonly',
        URL: 'readonly',
        crypto: 'readonly',
        requestAnimationFrame: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        Element: 'readonly',
        HTMLElement: 'readonly',
        Document: 'readonly',
        Image: 'readonly',
        HTMLImageElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLSpanElement: 'readonly',
        KeyboardEvent: 'readonly',
        Node: 'readonly',
        NodeListOf: 'readonly',
        getComputedStyle: 'readonly',
        // JSZip global
        JSZip: 'readonly',
        // D3/NVD3 globals
        d3: 'readonly',
        nv: 'readonly',
        // Reveal.js global
        Reveal: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // TypeScript rules - Start permissive, gradually tighten
      '@typescript-eslint/no-explicit-any': 'off', // Allow 'any' for gradual migration
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/ban-ts-comment': [
        'warn',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': true,
          'ts-nocheck': true,
        },
      ],

      // General code quality
      'no-console': 'off', // Allow console for debugging
      'no-debugger': 'warn',
      'no-unused-vars': 'off', // Use @typescript-eslint/no-unused-vars instead
      'prefer-const': 'warn',
      'no-var': 'warn',
      'no-redeclare': 'warn', // Warn instead of error to allow fixing other issues

      // Potential bugs
      'no-constant-condition': 'warn',
      'no-empty': 'warn',
      'no-extra-boolean-cast': 'warn',

      // Best practices
      'eqeqeq': ['warn', 'always', { null: 'ignore' }],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-with': 'error',
    },
  },

  // Test files - more permissive
  {
    files: ['src/__tests__/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },

  // Prettier compatibility - must be last
  prettierConfig,
];
