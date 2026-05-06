// @ts-check

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  // 1. Reglas recomendadas de JavaScript
  js.configs.recommended,

  // 2. Reglas recomendadas de TypeScript con type-checking
  ...tseslint.configs.recommendedTypeChecked,

  // 3. Configuración general para todos los archivos TS/JS
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Reglas adicionales personalizadas pueden ir aquí
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  // 4. Para archivos JS plain (sin type-checking de TypeScript)
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...tseslint.configs.disableTypeChecked,
  },

  // 5. Prettier al final (desactiva reglas que entren en conflicto con Prettier)
  prettierConfig,

  // 6. Ignorar carpetas
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/*.tsbuildinfo'],
  },
);
