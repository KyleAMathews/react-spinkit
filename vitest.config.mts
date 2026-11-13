import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['test/**/*.test.{ts,tsx}'],
    // React 18's oracle runs under vitest.react18.config.mts.
    exclude: ['test/react-18/**', '**/node_modules/**'],
  },
});
