/**
 * Shared base; repos spread this and add repo-specific entries
 * (e.g. kubernetes manifest validation, ansible-lint).
 *
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.{ts,tsx}': ['prettier --write', 'eslint --fix'],
  '*.{js,mjs,cjs,json,md,yaml,yml}': 'prettier --write',
};
