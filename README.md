# @stephenliang/tooling

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
pnpm add -D @stephenliang/tooling @types/node eslint prettier typescript
```

`@types/node` is required by `typescript/node`: TypeScript 6 no longer
auto-includes `node_modules/@types`, so the config declares
`"types": ["node"]` explicitly.

## Composition contract

Each config family composes differently — know which pattern applies before
extending one:

- **ESLint** — call the factory, spread the result into your own array:
  `export default [...node(import.meta.dirname), overrides]`.
- **Vitest** — the export is a `defineConfig` object; extend it with
  `mergeConfig`, not spreading.
- **Vite** — `lib()` is a factory; pass options (`{ entry, formats }`) or
  extend its result with `mergeConfig`.
- **Everything else** (prettier, lint-staged) — plain objects you
  spread/override directly.

## Dependency policy

Plugins used by layers every consuming repo pulls in (`eslint/node`,
prettier, lint-staged) are hard `dependencies` of this package, so they
install automatically. Opt-in layers that not every repo needs — `eslint/react`,
`vitest/react`, `vite/lib` and their plugins — are optional
`peerDependencies`: declare them yourself only if you use those layers.

## Usage

### ESLint (flat config, type-checked)

```js
// eslint.config.js
import { node } from '@stephenliang/tooling/eslint/node';

export default [...node(import.meta.dirname)];
```

Layers: `eslint/node`, `eslint/react` (needs the optional peers
`eslint-plugin-react` + `eslint-plugin-jsx-a11y`). Each factory takes exactly
the consumer's root directory; extend the result by spreading it alongside
your own entries. Test-file rules are a separate default-exported array to
spread in:

```js
import { node } from '@stephenliang/tooling/eslint/node';
import vitestRules from '@stephenliang/tooling/eslint/vitest';

export default [...node(import.meta.dirname), ...vitestRules];
```

### Prettier

```jsonc
// package.json
{ "prettier": "@stephenliang/tooling/prettier" }
```

### TypeScript

```jsonc
// tsconfig.json — node packages
{ "extends": "@stephenliang/tooling/typescript/node" }

// tsconfig.json — vite react apps
{ "extends": "@stephenliang/tooling/typescript/vite-react" }
```

### lint-staged

Keys are granular so a consumer repo can delete exactly the key it handles
differently. For example, this homelab repo lints YAML with `ansible-lint`
instead of prettier, so it drops that key:

```js
// lint-staged.config.mjs
import base from '@stephenliang/tooling/lint-staged';

export default {
  ...base,
  '*.{yaml,yml}': ['ansible-lint'], // override, not prettier
};
```

### Vitest (react/jsdom)

```ts
// vitest.config.ts
import { mergeConfig } from 'vitest/config';
import base from '@stephenliang/tooling/vitest/react';

export default mergeConfig(base, { test: { setupFiles: ['./setup.ts'] } });
```

### Vite library mode

Needs the optional peers `vite`, `vite-plugin-dts`,
`vite-plugin-externalize-deps`.

```ts
// vite.config.ts
import { lib } from '@stephenliang/tooling/vite/lib';

export default lib(); // { entry, formats } overridable
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
