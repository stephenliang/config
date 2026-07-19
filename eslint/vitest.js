import vitest from '@vitest/eslint-plugin';

/**
 * Extra layer for test files; spread into a base/node/react factory call:
 * `node(import.meta.dirname, ...vitestTests)`
 *
 * @type {import('eslint').Linter.Config[]}
 */
export const vitestTests = [
  {
    files: ['**/*.test.{ts,tsx}'],
    ...vitest.configs.recommended,
  },
];
