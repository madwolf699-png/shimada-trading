import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals'; // browser環境

export default [
  js.configs.recommended, // eslint:recommended
  {
    ignores: ['src/main.tsx', 'src/tests/**', '**/*.test.tsx', '**/*.spec.tsx'],
  },
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser, // <--- browser環境
      },
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      '@typescript-eslint': tsPlugin,
      jsdoc: jsdocPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      camelcase: ['error', { properties: 'always' }],
      eqeqeq: ['error', 'always'],
      indent: ['error', 2, { SwitchCase: 1 }],
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-trailing-spaces': 'error',
      'no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^[A-Z_]',
          argsIgnorePattern: '^_',
        },
      ],
      'no-var': 'error',
      'object-curly-spacing': ['error', 'always'],
      semi: ['error', 'always'],
      'prefer-const': 'error',

      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',

      // JSDoc
      'jsdoc/require-jsdoc': [
        'error',
        {
          contexts: [
            'FunctionDeclaration',
            'VariableDeclaration > VariableDeclarator > ArrowFunctionExpression',
            'ClassDeclaration',
          ],
          publicOnly: false,
        },
      ],
      'jsdoc/require-description': 'error',
      'jsdoc/check-tag-names': [
        'error',
        {
          definedTags: ['component', 'internal'],
        },
      ],
    },
    settings: {
      react: { version: 'detect' },
      jsdoc: { mode: 'typescript' },
    },
  },
  {
    files: ['**/*.test.tsx', '**/*.spec.tsx'],
    rules: {
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-description': 'off',
    },
  },
];
