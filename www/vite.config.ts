import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Published to https://kyleamathews.github.io/react-spinkit/
export default defineConfig({
  base: process.env.SITE_BASE ?? '/',
  plugins: [react()],
  // react-spinkit is linked from the workspace and ships CommonJS that
  // require()s its CSS, so it has to go through dependency pre-bundling.
  optimizeDeps: {
    include: ['react-spinkit', 'react-spinkit/dist/spinners'],
  },
});
