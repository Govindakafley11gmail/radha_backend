// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert ESM URL to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'], // ignore config file itself
  },
  eslint.configs.recommended, // base ESLint recommended rules
  ...tseslint.configs.recommendedTypeChecked, // TypeScript type-checked rules
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs', // or 'module' if you use ES modules
      parserOptions: {
        project: path.join(__dirname, 'tsconfig.json'), // absolute path to tsconfig
        tsconfigRootDir: __dirname, // absolute path
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      // prettier rules removed
    },
  },
);
