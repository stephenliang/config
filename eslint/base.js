import js from '@eslint/js';
import importX from 'eslint-plugin-import-x';
import tseslint from 'typescript-eslint';

/**
 * Type-checked base config. Every layer is a factory taking the consumer's
 * root directory so typescript-eslint's projectService resolves tsconfigs
 * relative to the consuming package, not this one.
 *
 * @param {string} tsconfigRootDir usually `import.meta.dirname`
 * @param {...import('typescript-eslint').ConfigArray[number]} extra
 */
export function base(tsconfigRootDir, ...extra) {
  return tseslint.config(
    {
      ignores: ['dist/**', 'bin/**', 'eslint.config.*'],
    },
    js.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    importX.flatConfigs.recommended,
    importX.flatConfigs.typescript,
    {
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
    },
    {
      rules: {
        'import-x/no-cycle': 'error',
        'import-x/no-duplicates': 'error',
        'import-x/order': [
          'error',
          {
            'newlines-between': 'always',
            groups: [
              ['builtin', 'external'],
              'internal',
              'parent',
              'sibling',
              'index',
            ],
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
          },
        ],
      },
    },
    ...extra,
  );
}
