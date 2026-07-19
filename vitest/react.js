import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

/**
 * Base for React + jsdom packages. Extend via `mergeConfig` in the consuming
 * package's vitest.config.ts for per-package options like `setupFiles`.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
});
