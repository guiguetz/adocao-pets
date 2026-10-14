import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      '.impeccable/**',
      '.github/**',
      '.pi/**',
      'node_modules/**',
      '.next/**',
      'dist/**',
      'tools/**',
    ],
  },
  ...compat.extends('next/core-web-vitals'),
  {
    rules: {
      'no-console': 'warn',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@prisma/client'],
              message: 'Use the repository layer in src/server/db/ for database access.',
            },
          ],
        },
      ],
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 40, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ['src/server/db/**/*.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
];

export default eslintConfig;
