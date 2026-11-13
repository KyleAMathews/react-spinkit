import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// The oracles again on React 18, which the peer range (`react >=15.3.0`) still
// covers, and the PropTypes oracle, since only React 18 and earlier check them.
// React comes from the private test/react-18 package, so its react-dom uses it too.
const react18 = createRequire(fileURLToPath(new URL('./test/react-18/package.json', import.meta.url)));
const reactAliases = ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-dom', 'react-dom/client'].map(
  (id) => ({ find: new RegExp(`^${id}$`), replacement: react18.resolve(id) }),
);

export default defineConfig({
  resolve: { alias: reactAliases },
  test: {
    environment: 'jsdom',
    include: ['test/*.oracle.property.test.tsx', 'test/react-18/*.oracle.property.test.tsx'],
  },
});
