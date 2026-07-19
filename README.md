# @stephenliang/toolkit

Shared tooling configs for personal pnpm/turborepo monorepos. One package,
subpath exports, published to GitHub Packages.

## Install

Consuming repos need an `.npmrc` mapping the scope to GitHub Packages:

```ini
@stephenliang:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Locally, supply the token from `gh` without writing it to disk
(requires the `read:packages` scope — `gh auth refresh -s read:packages`):

```sh
NODE_AUTH_TOKEN=$(gh auth token) pnpm install
```

In GitHub Actions the built-in token works:

```yaml
- run: pnpm install --frozen-lockfile
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

```sh
pnpm add -D @stephenliang/toolkit @types/node eslint prettier typescript
```

`@types/node` is required by `typescript/node`: TypeScript 6 no longer
auto-includes `node_modules/@types`, so the config declares
`"types": ["node"]` explicitly.

## Usage

### ESLint (flat config, type-checked)

```js
// eslint.config.js
import { node } from '@stephenliang/toolkit/eslint/node';

export default node(import.meta.dirname);
```

Layers: `eslint/base`, `eslint/node`, `eslint/react` (needs the optional
peers `eslint-plugin-react` + `eslint-plugin-jsx-a11y`). Each factory takes
extra flat-config objects after the root dir. Test-file rules:

```js
import { node } from '@stephenliang/toolkit/eslint/node';
import { vitestTests } from '@stephenliang/toolkit/eslint/vitest';

export default node(import.meta.dirname, ...vitestTests);
```

### Prettier

```jsonc
// package.json
{ "prettier": "@stephenliang/toolkit/prettier" }
```

### TypeScript

```jsonc
// tsconfig.json — node packages
{ "extends": "@stephenliang/toolkit/typescript/node" }

// tsconfig.json — vite react apps
{ "extends": "@stephenliang/toolkit/typescript/vite-react" }
```

### lint-staged

```js
// lint-staged.config.mjs
import base from '@stephenliang/toolkit/lint-staged';

export default {
  ...base,
  // repo-specific entries here
};
```

### Vitest (react/jsdom)

```ts
// vitest.config.ts
import { mergeConfig } from 'vitest/config';
import base from '@stephenliang/toolkit/vitest/react';

export default mergeConfig(base, { test: { setupFiles: ['./setup.ts'] } });
```

### Vite library mode

Needs the optional peers `vite`, `vite-plugin-dts`,
`vite-plugin-externalize-deps`.

```ts
// vite.config.ts
import { libConfig } from '@stephenliang/toolkit/vite/lib';

export default libConfig(); // { entry, formats } overridable
```

## Turborepo reference

Turbo cannot extend a root `turbo.json` from a package; copy this baseline:

```jsonc
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "test": { "dependsOn": ["^build"] },
    "lint": { "dependsOn": ["^build"] },
    "typecheck": { "dependsOn": ["^build"] },
    "format": { "cache": false },
    "format:check": {},
  },
}
```

## Releasing

Bump `version` in package.json, merge to main, then tag — CI publishes:

```sh
git tag v0.x.y && git push origin v0.x.y
```
