import { Spinner } from './Spinner';

/**
 * Whether the consumer opted out of the bundled CSS (e.g. for server-side
 * rendering) by setting `process.env.REACT_SPINKIT_NO_STYLES`.
 *
 * The expression is read verbatim so bundlers that replace it at build time
 * (webpack's DefinePlugin, Vite/esbuild `define`) keep working. The try/catch
 * covers browser bundles where `process` doesn't exist at all, such as Vite's
 * dev server or webpack 5 without a `process` polyfill.
 */
function stylesDisabled(): boolean {
  try {
    return Boolean(process.env.REACT_SPINKIT_NO_STYLES);
  } catch {
    return false;
  }
}

if (!stylesDisabled()) {
  /* eslint-disable @typescript-eslint/no-require-imports -- CSS is loaded for its side effects */
  require('loaders.css');
  require('../css/base.css');
  require('../css/loaders-css.css');
  require('../css/fade-in.css');
  require('../css/chasing-dots.css');
  require('../css/circle.css');
  require('../css/cube-grid.css');
  require('../css/double-bounce.css');
  require('../css/folding-cube.css');
  require('../css/pulse.css');
  require('../css/rotating-plane.css');
  require('../css/three-bounce.css');
  require('../css/wandering-cubes.css');
  require('../css/wave.css');
  require('../css/wordpress.css');
  /* eslint-enable @typescript-eslint/no-require-imports */
}

export = Spinner;
