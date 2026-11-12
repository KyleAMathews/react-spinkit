/*
 * This oracle owns what importing `react-spinkit` does: which bundled CSS
 * files the styled entry requests, that the import returns the component,
 * and that the CSS it loads lets `color` paint every spinner. It is checked
 * on a fresh import of `src/index.ts` per history, and on the computed paint
 * of all 33 spinners in headless Chrome. It owns `src/index.ts` and
 * `src/unstyled.ts`.
 *
 * ```js
 * require('react-spinkit')                               // → Spinner; requests each of the 15 CSS files once
 * process.env.REACT_SPINKIT_NO_STYLES = 'false'; require(…) // → Spinner; requests no CSS (any non-empty value)
 * require('react-spinkit/dist/unstyled') === require('react-spinkit') // → true
 * <Spinner name="pacman" color="rgb(1, 2, 3)" />         // → every painted part of every dot is rgb(1, 2, 3)
 * ```
 *
 * Why does `REACT_SPINKIT_NO_STYLES=false` turn the styles off? The switch
 * asks only whether the flag is set, and an environment variable is always a
 * string: `"false"` is a non-empty string, so it is set.
 *
 * Three parts decide the outcome. The flag is read from `process.env`, where
 * a missing `process.env`, or one that throws when read, counts as unset. The
 * bundle is every stylesheet in `css/` except `fading-circle.css`, plus
 * loaders.css itself. The cascade is the order the entry requests them in:
 * the files that adapt loaders.css to `color` must come after loaders.css,
 * which paints its spinners white.
 *
 * Styles switch: for every value of `REACT_SPINKIT_NO_STYLES`, importing the
 * entry requests each bundled CSS file exactly once when the flag is missing
 * or empty, including when `process.env` is missing or throws, and none when
 * it is set to any non-empty string. Import never throws: in each of those
 * environments the import returns the component. Same component: the styled
 * and unstyled entries export the same component, which renders a spinner.
 * Paint follows color: for every spinner, with the CSS the entry requests in
 * the order it requests it, the spinner paints something, and every painted
 * part of every dot (background and visible borders, `::before` and `::after`
 * included) is the outer div's text color, so `color` sets the whole
 * spinner; the one exception is `wordpress`'s inner dot, which is white.
 *
 * The model knows the bundle from the package's `css/` directory and the flag
 * rule from the decision below; it never reads `src/`. The driver imports
 * `src/index.ts` through Vitest after `vi.resetModules()`, so each history
 * evaluates the entry again (and the gap check's mutants reach it), and
 * records every `.css` request at `Module._load` instead of loading it. For
 * paint, the driver writes one page with the requested CSS in request order
 * and every spinner rendered by the imported component, runs headless Chrome
 * on it (`--dump-dom`), and records each dot's computed background and
 * visible border colors beside the outer div's color. Animations are frozen;
 * no keyframe in the bundle animates a color.
 *
 * Limits: an environment with no `process` global, and a bundler that
 * replaces the flag at build time, need the built file; `scripts/smoke-dist.cjs`
 * covers them on `dist/index.js`. Paint is read in Chrome only, with
 * animations frozen. Chrome must be installed (in /Applications on macOS,
 * or as google-chrome or chromium on PATH); without it, the paint law fails.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import Module from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import fc from 'fast-check';
import { vi } from 'vitest';
import { differs, oracleProperty, pass, type Observation } from '@tanstack/oracles';

// A path from the string, not `new URL`: under jsdom, URL is jsdom's, which fileURLToPath refuses.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DECISION =
  'Decision by Kyle Mathews (GitHub KyleAMathews), 2026-11-12: any non-empty REACT_SPINKIT_NO_STYLES counts as set, "false" and "0" included (README, "Server-side rendering and loading CSS yourself").';

// --- The model -----------------------------------------------------------------
// The bundle: every stylesheet the package ships in css/, except fading-circle.css
// (its spinner was removed in bedbd91; decision by Kyle Mathews, GitHub
// KyleAMathews, 2026-11-12: the file stays shipped, unloaded), plus loaders.css.
const BUNDLE = [
  'loaders.css',
  ...readdirSync(path.join(ROOT, 'css'))
    .filter((file) => file.endsWith('.css') && file !== 'fading-circle.css')
    .map((file) => `css/${file}`),
].sort();

type EnvShape = 'env' | 'no env' | 'env throws';
interface EntryHistory {
  flag: string | undefined;
  env: EnvShape;
}

// The flag rule: set means present and non-empty; an unreadable env is unset.
const flagSet = (h: EntryHistory) => h.env === 'env' && h.flag !== undefined && h.flag !== '';

function entryModel(plan: EntryHistory) {
  return { css: flagSet(plan) ? [] : BUNDLE, error: null, isComponent: true, same: true };
}

// --- Histories -----------------------------------------------------------------
const FLAG_WORDS = ['1', 'true', 'false', '0', 'no', ' ', 'undefined'];
const entryArb: fc.Arbitrary<EntryHistory> = fc.record({
  flag: fc.oneof(
    { arbitrary: fc.constantFrom<string | undefined>(undefined, ''), weight: 2 },
    { arbitrary: fc.constantFrom(...FLAG_WORDS), weight: 2 },
    { arbitrary: fc.string({ unit: 'grapheme-ascii', maxLength: 6 }), weight: 1 },
  ),
  env: fc.constantFrom<EnvShape>('env', 'env', 'env', 'no env', 'env throws'),
});

function entryReached(plan: EntryHistory): Array<string> {
  if (plan.env !== 'env') return [plan.env];
  if (plan.flag === undefined) return ['flag missing'];
  if (plan.flag === '') return ['flag empty'];
  return plan.flag === 'false' || plan.flag === '0' ? ['flag set', 'flag spelled off'] : ['flag set'];
}

const entryHistories = {
  arbitrary: entryArb,
  states: ['flag missing', 'flag empty', 'flag set', 'flag spelled off', 'no env', 'env throws'],
  runs: 50,
  fixedSeeds: [20261112],
  constructed: [
    { name: 'flag missing', enters: ['flag missing'], build: (): EntryHistory => ({ flag: undefined, env: 'env' }) },
    { name: 'flag empty', enters: ['flag empty'], build: (): EntryHistory => ({ flag: '', env: 'env' }) },
    { name: 'flag set', enters: ['flag set'], build: (): EntryHistory => ({ flag: '1', env: 'env' }) },
    {
      name: 'flag spelled off',
      enters: ['flag set', 'flag spelled off'],
      build: (): EntryHistory => ({ flag: 'false', env: 'env' }),
    },
    { name: 'no env', enters: ['no env'], build: (g: EntryHistory): EntryHistory => ({ ...g, env: 'no env' }) },
    { name: 'env throws', enters: ['env throws'], build: (g: EntryHistory): EntryHistory => ({ ...g, env: 'env throws' }) },
  ],
};

// --- The driver ------------------------------------------------------------------
const describeError = (e: unknown) => (e instanceof Error ? `${e.name}: ${e.message}` : String(e));
type Loader = (request: string, parent: unknown, isMain: boolean) => unknown;

/** Imports the entry afresh, recording each CSS request (as a package path) instead of loading it. */
async function importEntry(): Promise<{ requested: Array<string>; entry?: unknown; unstyled?: unknown; error: string | null }> {
  const requested: Array<string> = [];
  const modules = Module as unknown as { _load: Loader };
  const load = modules._load;
  modules._load = function (this: unknown, request, parent, isMain) {
    if (request === 'loaders.css' || request.endsWith('.css')) {
      requested.push(request === 'loaders.css' ? request : path.posix.normalize(`src/${request}`));
      return {};
    }
    return load.call(this, request, parent, isMain);
  };
  try {
    vi.resetModules();
    const entry = (await import('../src/index')).default;
    const unstyled = (await import('../src/unstyled')).default;
    return { requested, entry, unstyled, error: null };
  } catch (e) {
    return { requested, error: describeError(e) };
  } finally {
    modules._load = load;
  }
}

/** Runs `body` with process.env shaped as the history says, then restores it. */
async function withEnv<T>(plan: EntryHistory, body: () => Promise<T>): Promise<T> {
  const descriptor = Object.getOwnPropertyDescriptor(process, 'env')!;
  const before = process.env.REACT_SPINKIT_NO_STYLES;
  try {
    if (plan.env === 'env') {
      if (plan.flag === undefined) delete process.env.REACT_SPINKIT_NO_STYLES;
      else process.env.REACT_SPINKIT_NO_STYLES = plan.flag;
    } else {
      const env = descriptor.value as NodeJS.ProcessEnv;
      // Only the entry's own read sees the shaped env: Vitest's module runner
      // also reads process.env, even while the entry's imports load, so the
      // immediate caller (the frame below this getter) must be src/index.ts.
      Object.defineProperty(process, 'env', {
        configurable: true,
        get() {
          const caller = new Error().stack?.split('\n')[2] ?? '';
          const fromEntry = caller.includes(`${path.sep}src${path.sep}index.ts`);
          if (!fromEntry) return env;
          if (plan.env === 'env throws') throw new Error('process.env is not readable here');
          return undefined;
        },
      });
    }
    return await body();
  } finally {
    Object.defineProperty(process, 'env', descriptor);
    if (before === undefined) delete process.env.REACT_SPINKIT_NO_STYLES;
    else process.env.REACT_SPINKIT_NO_STYLES = before;
  }
}

async function entryDriver(plan: EntryHistory, observe: (checkpoint: string, value: unknown) => void): Promise<void> {
  const loaded = await withEnv(plan, importEntry);
  observe('import', { error: loaded.error });
  observe('css', [...loaded.requested].sort());
  if (loaded.error === null) {
    const render = (component: unknown) =>
      typeof component === 'function'
        ? renderToStaticMarkup(React.createElement(component as React.ComponentType<{ name: string }>, { name: 'pulse' }))
        : null;
    observe('exports', {
      isComponent: /class="[^"]*sk-pulse[^"]*"/.test(render(loaded.entry) ?? ''),
      same: loaded.entry === loaded.unstyled,
    });
  }
}

// --- The checks ------------------------------------------------------------------
const read = (observations: ReadonlyArray<Observation>, checkpoint: string) =>
  observations.find((o) => o.checkpoint === checkpoint)?.value;
const imported = (observations: ReadonlyArray<Observation>) =>
  (read(observations, 'import') as { error: string | null }).error === null;

const entryShared = { histories: entryHistories, model: entryModel, driver: entryDriver, reached: entryReached };

oracleProperty({
  id: 'styles-switch',
  law: {
    statement:
      'For every value of REACT_SPINKIT_NO_STYLES, importing the entry requests each bundled CSS file exactly once when the flag is missing or empty (including when process.env is missing or throws when read), and none when it is set to any non-empty string.',
    authority: `README, "Server-side rendering and loading CSS yourself": "This will skip the import of styles"; README, "CSS is loaded automatically". ${DECISION}`,
    limits:
      'No process global, and a flag replaced at build time, are covered by scripts/smoke-dist.cjs on dist/index.js. Flag strings are ASCII.',
  },
  ...entryShared,
  owns: ['src/index.ts', 'src/unstyled.ts'],
  check: (_plan, observations, expected) =>
    imported(observations) ? (differs('css', 'styles-switch', read(observations, 'css'), expected.css) ?? pass) : pass,
  calibrations: [
    {
      name: 'one stylesheet is not requested',
      law: 'styles-switch',
      history: { constructed: 'flag missing' },
      corrupt: (trace) => trace.map((o) => (o.checkpoint === 'css' ? { ...o, value: (o.value as Array<string>).slice(1) } : o)),
    },
  ],
});

oracleProperty({
  id: 'import-never-throws',
  law: {
    statement:
      'For every environment above (any flag value, a missing process.env, or one that throws when read), importing the entry returns the component instead of throwing.',
    authority:
      'Bug report by Kyle Mathews (GitHub KyleAMathews), 2026-11-11: importing react-spinkit threw "process is not defined" in browser bundles.',
    limits: 'No process global is covered by scripts/smoke-dist.cjs on dist/index.js.',
  },
  ...entryShared,
  owns: ['src/index.ts', 'src/unstyled.ts'],
  check: (_plan, observations) => differs('import', 'import-never-throws', read(observations, 'import'), { error: null }) ?? pass,
  calibrations: [
    {
      name: 'the import throws',
      law: 'import-never-throws',
      history: { constructed: 'env throws' },
      corrupt: (trace) => trace.map((o) => (o.checkpoint === 'import' ? { ...o, value: { error: 'ReferenceError: planted' } } : o)),
    },
  ],
});

oracleProperty({
  id: 'same-component',
  law: {
    statement:
      'For every environment above, the styled entry and react-spinkit/dist/unstyled export the same component, and it renders a spinner.',
    authority: 'test/index.test.tsx:104 "should export the same component from the unstyled entry point"; README, unstyled entry point.',
    limits: 'The component itself is the main oracle\'s (test/spinner.oracle.property.test.tsx).',
  },
  ...entryShared,
  owns: ['src/index.ts', 'src/unstyled.ts'],
  check: (_plan, observations, expected) =>
    imported(observations)
      ? (differs('exports', 'same-component', read(observations, 'exports'), { isComponent: expected.isComponent, same: expected.same }) ?? pass)
      : pass,
  calibrations: [
    {
      name: 'the entries export different components',
      law: 'same-component',
      history: { constructed: 'flag set' },
      corrupt: (trace) =>
        trace.map((o) => (o.checkpoint === 'exports' ? { ...o, value: { ...(o.value as object), same: false } } : o)),
    },
  ],
});

// --- Paint follows color ---------------------------------------------------------
// The built-in names (SpinKit's and the loaders.css spinners this package includes).
const SPINNER_NAMES = [
  'circle', 'cube-grid', 'wave', 'folding-cube', 'three-bounce', 'double-bounce', 'wandering-cubes',
  'chasing-dots', 'rotating-plane', 'pulse', 'wordpress', 'ball-grid-beat', 'ball-grid-pulse',
  'line-spin-fade-loader', 'ball-spin-fade-loader', 'ball-pulse-rise', 'line-scale', 'line-scale-pulse-out',
  'line-scale-pulse-out-rapid', 'pacman', 'line-scale-party', 'ball-triangle-path', 'ball-scale-multiple',
  'ball-scale-ripple-multiple', 'ball-pulse-sync', 'ball-beat', 'ball-zig-zag', 'ball-zig-zag-deflect',
  'ball-clip-rotate-pulse', 'ball-clip-rotate-multiple', 'ball-clip-rotate', 'ball-scale-ripple', 'triangle-skew-spin',
];
const SET_COLOR = 'rgb(1, 2, 3)';
// Decision by Kyle Mathews (GitHub KyleAMathews), 2026-11-12: wordpress's inner
// dot is white by design (css/wordpress.css), the one part `color` does not paint.
const WHITE_HOLE = { spinner: 'wordpress', part: '1::after bg', color: 'rgb(255, 255, 255)' };

interface PaintHistory {
  variant: 'with color' | 'default color';
}
type Paint = Record<string, { text: string; parts: Array<{ part: string; color: string }> }>;

function findChrome(): string {
  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    ...['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'].map((name) => {
      try {
        return execFileSync('which', [name], { encoding: 'utf8' }).trim();
      } catch {
        return undefined;
      }
    }),
  ];
  const found = candidates.find((candidate) => candidate && existsSync(candidate));
  if (!found) throw new Error('paint-follows-color needs Chrome: install it, or put google-chrome or chromium on PATH');
  return found;
}

// Runs in the page: each dot's painted colors, beside the outer div's color.
const PAGE_SCRIPT = `
const painted = (cs) => {
  const out = [];
  const bg = cs.backgroundColor;
  if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') out.push(['bg', bg]);
  for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
    const w = parseFloat(cs['border' + side + 'Width']), st = cs['border' + side + 'Style'], c = cs['border' + side + 'Color'];
    if (w > 0 && st !== 'none' && st !== 'hidden' && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') out.push(['border-' + side.toLowerCase(), c]);
  }
  return out;
};
const result = {};
for (const section of document.querySelectorAll('section')) {
  const spinner = section.firstElementChild, parts = [];
  spinner.querySelectorAll('div').forEach((dot, i) => {
    for (const pseudo of [null, '::before', '::after']) {
      const cs = getComputedStyle(dot, pseudo);
      if (pseudo && (cs.content === 'none' || cs.content === 'normal')) continue;
      for (const [what, color] of painted(cs)) parts.push({ part: (i + 1) + (pseudo || '') + ' ' + what, color });
    }
  });
  result[section.dataset.name] = { text: getComputedStyle(spinner).color, parts };
}
document.body.setAttribute('data-result', JSON.stringify(result));`;

const unescapeHtml = (s: string) =>
  s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

async function paintDriver(plan: PaintHistory, observe: (checkpoint: string, value: unknown) => void): Promise<void> {
  const loaded = await withEnv({ flag: undefined, env: 'env' }, importEntry);
  observe('import', { error: loaded.error });
  if (loaded.error !== null) return;
  const css = loaded.requested
    .map((file) => readFileSync(file === 'loaders.css' ? path.join(ROOT, 'node_modules/loaders.css/loaders.css') : path.join(ROOT, file), 'utf8'))
    .join('\n');
  const Spinner = loaded.entry as React.ComponentType<{ name: string; fadeIn: string; color?: string }>;
  const sections = SPINNER_NAMES.map(
    (name) =>
      `<section data-name="${name}">${renderToStaticMarkup(
        React.createElement(Spinner, { name, fadeIn: 'none', ...(plan.variant === 'with color' ? { color: SET_COLOR } : {}) }),
      )}</section>`,
  ).join('\n');
  const dir = mkdtempSync(path.join(os.tmpdir(), 'spinkit-paint-'));
  try {
    const page = path.join(dir, 'paint.html');
    writeFileSync(page, `<!doctype html><html><head><style>${css}\n*{animation:none!important}</style></head><body>${sections}<script>${PAGE_SCRIPT}</script></body></html>`);
    const dom = execFileSync(
      findChrome(),
      ['--headless=new', '--disable-gpu', '--no-first-run', '--no-sandbox', `--user-data-dir=${path.join(dir, 'profile')}`, '--dump-dom', `file://${page}`],
      { encoding: 'utf8', timeout: 60_000, stdio: ['ignore', 'pipe', 'ignore'] },
    );
    const match = /data-result="([^"]*)"/.exec(dom);
    if (!match) throw new Error('Chrome returned no paint result');
    observe('paint', JSON.parse(unescapeHtml(match[1])) as Paint);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

oracleProperty({
  id: 'paint-follows-color',
  law: {
    statement:
      "For every spinner, with the CSS the entry requests in the order it requests it, the spinner paints something, and every painted part of every dot (background and visible borders, ::before and ::after included) is the outer div's text color, so color sets the whole spinner; the one exception is wordpress's inner dot, which is white.",
    authority:
      'README, PropTypes: "color-programmatically set the color of the spinners". The wordpress exception: Decision by Kyle Mathews (GitHub KyleAMathews), 2026-11-12: the white inner dot is part of the design.',
    limits: 'Paint is read in Chrome only, with animations frozen (no keyframe in the bundle animates a color). Needs Chrome.',
  },
  histories: { enumerated: [{ variant: 'with color' }, { variant: 'default color' }], states: ['with color', 'default color'] },
  label: (h: PaintHistory) => h.variant,
  model: (plan: PaintHistory) => ({ text: plan.variant === 'with color' ? SET_COLOR : undefined }),
  reached: (plan: PaintHistory) => [plan.variant],
  driver: paintDriver,
  owns: ['src/index.ts', 'src/unstyled.ts'],
  timeout: 120_000,
  check: (_plan, observations, expected) => {
    if (!imported(observations)) return pass;
    const paint = read(observations, 'paint') as Paint;
    const seen: Record<string, unknown> = {};
    const owed: Record<string, unknown> = {};
    for (const name of SPINNER_NAMES) {
      const spinner = paint[name] ?? { text: 'missing', parts: [] };
      // The text color is what color sets (or the default, without it).
      const text = expected.text ?? spinner.text;
      const ownColor = (part: string) =>
        name === WHITE_HOLE.spinner && part === WHITE_HOLE.part ? WHITE_HOLE.color : text;
      seen[name] = { text: spinner.text, painted: spinner.parts.length > 0, parts: spinner.parts };
      owed[name] = { text, painted: true, parts: spinner.parts.map(({ part }) => ({ part, color: ownColor(part) })) };
    }
    return differs('paint', 'paint-follows-color', seen, owed, 'a spinner paints a part in a color other than its text color') ?? pass;
  },
  calibrations: [
    {
      name: 'pacman keeps loaders.css white',
      law: 'paint-follows-color',
      history: { enumerated: 0 },
      corrupt: (trace) =>
        trace.map((o) => {
          if (o.checkpoint !== 'paint') return o;
          const paint = structuredClone(o.value as Paint);
          paint.pacman.parts[0].color = 'rgb(255, 255, 255)';
          return { ...o, value: paint };
        }),
    },
  ],
});
