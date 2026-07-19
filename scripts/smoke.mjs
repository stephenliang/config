import assert from 'node:assert/strict';

const checks = [
  [
    'eslint/base',
    async () => {
      const { base } = await import('../eslint/base.js');
      assert.ok(base(import.meta.dirname).length > 0);
    },
  ],
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
      const { vitestTests } = await import('../eslint/vitest.js');
      assert.ok(vitestTests.length > 0);
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
      assert.equal(config.test.environment, 'jsdom');
    },
  ],
  [
    'vite/lib',
    async () => {
      const { libConfig } = await import('../vite/lib.js');
      const config = libConfig();
      assert.ok(config.build.lib.entry.length > 0);
      assert.equal(config.build.rollupOptions.output.length, 1);
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
    console.error(`FAIL ${name}:`, error.message);
  }
}
process.exit(failed ? 1 : 0);
