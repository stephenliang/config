import globals from 'globals';

import { base } from './base.js';

/**
 * Node.js packages.
 *
 * @param {string} tsconfigRootDir usually `import.meta.dirname`
 * @param {...import('typescript-eslint').ConfigArray[number]} extra
 */
export function node(tsconfigRootDir, ...extra) {
  return base(
    tsconfigRootDir,
    { languageOptions: { globals: { ...globals.node } } },
    ...extra,
  );
}
