// Checks the built entry points the way consumers load them:
//  1. CommonJS / server-side rendering in Node (see the README).
//  2. Bundled browser code, where `process` may be missing or may have been
//     replaced at build time. Each entry point is evaluated in a fresh VM
//     context, and we record which CSS files it tries to load.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');

const distDir = path.join(__dirname, '..', 'dist');
// The bundle the styled entry must request: every stylesheet in css/ except
// fading-circle.css (its spinner was removed), plus loaders.css itself.
const BUNDLE = [
  'loaders.css',
  ...fs
    .readdirSync(path.join(__dirname, '..', 'css'))
    .filter((file) => file.endsWith('.css') && file !== 'fading-circle.css')
    .map((file) => `../css/${file}`),
].sort();

function evaluateEntry(file, { globals = {}, transform = (code) => code } = {}) {
  const filename = path.join(distDir, file);
  const realRequire = createRequire(filename);
  const cssRequests = [];
  const sandboxRequire = (id) => {
    if (id.endsWith('.css')) {
      cssRequests.push(id);
      return {};
    }
    return realRequire(id);
  };
  const module = { exports: {} };
  const code = transform(fs.readFileSync(filename, 'utf8'));
  const context = vm.createContext({ console, ...globals });
  const wrapper = vm.runInContext(`(function (module, exports, require) {\n${code}\n})`, context, {
    filename,
  });
  wrapper(module, module.exports, sandboxRequire);
  return { Spinner: module.exports, cssRequests };
}

const envExpression = 'process.env.REACT_SPINKIT_NO_STYLES';
const scenarios = [
  { name: 'no `process` global (Vite dev, webpack 5)', globals: {}, css: BUNDLE },
  { name: '`process` without the flag', globals: { process: { env: {} } }, css: BUNDLE },
  { name: 'flag set at runtime', globals: { process: { env: { REACT_SPINKIT_NO_STYLES: '1' } } }, css: [] },
  {
    name: 'flag replaced at build time (DefinePlugin), no `process`',
    transform: (code) => code.replaceAll(envExpression, '"true"'),
    css: [],
  },
  {
    name: '`process.env` replaced with {} (Vite build), no `process`',
    transform: (code) => code.replaceAll('process.env', '({})'),
    css: BUNDLE,
  },
];

assert.ok(fs.readFileSync(path.join(distDir, 'index.js'), 'utf8').includes(envExpression));

// The built files must parse as ES2017, so bundlers with older parsers
// (webpack 4's acorn 6) keep working, as they did with 3.0.0's ES5 build.
const { parse } = require('acorn');
const ECMA_VERSION = 2017;
for (const file of fs.readdirSync(distDir).filter((f) => f.endsWith('.js'))) {
  const code = fs.readFileSync(path.join(distDir, file), 'utf8');
  try {
    parse(code, { ecmaVersion: ECMA_VERSION, sourceType: 'script' });
  } catch (error) {
    assert.fail(`dist/${file} does not parse as ES${ECMA_VERSION}: ${error.message}`);
  }
}
console.log(`ok - dist/*.js parse as ES${ECMA_VERSION}`);

for (const scenario of scenarios) {
  const { Spinner, cssRequests } = evaluateEntry('index.js', scenario);
  assert.equal(typeof Spinner, 'function', `${scenario.name}: should export the component`);
  assert.deepEqual([...cssRequests].sort(), scenario.css, `${scenario.name}: CSS files requested`);
  console.log(`ok - index.js: ${scenario.name}: ${cssRequests.length} CSS files`);
}

{
  const { Spinner, cssRequests } = evaluateEntry('unstyled.js');
  assert.equal(typeof Spinner, 'function');
  assert.equal(cssRequests.length, 0);
  console.log('ok - unstyled.js: no CSS files');
}

// Real Node require() + server rendering, as documented in the README.
process.env.REACT_SPINKIT_NO_STYLES = '1';
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const Spinner = require('..');
const { allSpinners } = require('../dist/spinners');

assert.equal(typeof Spinner, 'function', 'require("react-spinkit") should return the component');
assert.equal(require('../dist/unstyled'), Spinner, 'unstyled entry should export the same component');

for (const [name, info] of Object.entries(allSpinners)) {
  const html = renderToStaticMarkup(React.createElement(Spinner, { name }));
  assert.ok(html.includes(info.className ?? name), `${name}: missing class in ${html}`);
  assert.equal(html.match(/<div/g).length, info.divCount + 1, `${name}: wrong div count`);
}

console.log(`ok - server rendering (${Object.keys(allSpinners).length} spinners)`);
