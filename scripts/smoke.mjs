import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const STRICTNESS_KEYS = [
  'strict',
  'exactOptionalPropertyTypes',
  'noUncheckedIndexedAccess',
  'noImplicitOverride',
  'noImplicitReturns',
  'noUnusedLocals',
  'noUnusedParameters',
  'isolatedModules',
];

const PER_TARGET_KEYS = new Set([
  'target',
  'lib',
  'module',
  'moduleResolution',
  'types',
  'jsx',
  'noEmit',
]);

/** @type {Array<[string, () => Promise<void>]>} */
const checks = [
  [
    'eslint/node',
    async () => {
      const { node } = await import('../eslint/node.js');
      assert.ok(node(import.meta.dirname).length > 0);
    },
  ],
  [
    'eslint/react',
    async () => {
      const { react } = await import('../eslint/react.js');
      assert.ok(react(import.meta.dirname).length > 0);
    },
  ],
  [
    'eslint/vitest',
    async () => {
      const { default: vitestRules } = await import('../eslint/vitest.js');
      assert.ok(vitestRules.length > 0);
    },
  ],
  [
    'prettier',
    async () => {
      const { default: config } = await import('../prettier/index.js');
      assert.equal(config.singleQuote, true);
    },
  ],
  [
    'lint-staged',
    async () => {
      const { default: config } = await import('../lint-staged/index.js');
      assert.ok(config['*.{ts,tsx}']);
    },
  ],
  [
    'vitest/react',
    async () => {
      const { default: config } = await import('../vitest/react.js');
      assert.ok(config.test);
      assert.equal(config.test.environment, 'jsdom');
    },
  ],
  [
    'vite/lib',
    async () => {
      const { lib } = await import('../vite/lib.js');
      const config = lib();
      assert.ok(config.build);
      assert.ok(config.build.lib);
      const entry = config.build.lib.entry;
      assert.ok(Array.isArray(entry) && entry.length > 0);
      assert.ok(config.build.rollupOptions);
      const output = config.build.rollupOptions.output;
      assert.ok(Array.isArray(output) && output.length === 1);
    },
  ],
  [
    'typescript/node <-> typescript/vite-react agree on shared strictness',
    async () => {
      const [node, viteReact] = await Promise.all([
        readFile(new URL('../typescript/node.json', import.meta.url), 'utf8'),
        readFile(
          new URL('../typescript/vite-react.json', import.meta.url),
          'utf8',
        ),
      ]);
      const nodeOptions = JSON.parse(node).compilerOptions;
      const viteReactOptions = JSON.parse(viteReact).compilerOptions;

      const sharedKeys = Object.keys(nodeOptions).filter(
        (key) => key in viteReactOptions && !PER_TARGET_KEYS.has(key),
      );
      assert.ok(sharedKeys.length > 0);
      for (const key of sharedKeys) {
        assert.deepEqual(
          nodeOptions[key],
          viteReactOptions[key],
          `compilerOptions.${key} diverges between node.json and vite-react.json`,
        );
      }

      for (const key of STRICTNESS_KEYS) {
        assert.ok(key in nodeOptions, `node.json missing ${key}`);
        assert.ok(key in viteReactOptions, `vite-react.json missing ${key}`);
      }
    },
  ],
];

let failed = false;
for (const [name, check] of checks) {
  try {
    await check();
    console.log(`ok ${name}`);
  } catch (error) {
    failed = true;
    console.error(
      `FAIL ${name}:`,
      error instanceof Error ? error.message : error,
    );
  }
}
process.exit(failed ? 1 : 0);
