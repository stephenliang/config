import jsxA11y from 'eslint-plugin-jsx-a11y';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';

import { base } from './base.js';

/**
 * React (browser) packages. Requires the optional peers
 * eslint-plugin-react and eslint-plugin-jsx-a11y.
 *
 * @param {string} tsconfigRootDir usually `import.meta.dirname`
 * @param {...import('typescript-eslint').ConfigArray[number]} extra
 */
export function react(tsconfigRootDir, ...extra) {
  return base(
    tsconfigRootDir,
    jsxA11y.flatConfigs.strict,
    {
      languageOptions: {
        globals: { ...globals.node, ...globals.browser },
      },
    },
    {
      ...pluginReact.configs.flat['jsx-runtime'],
      settings: { react: { version: 'detect' } },
    },
    ...extra,
  );
}
