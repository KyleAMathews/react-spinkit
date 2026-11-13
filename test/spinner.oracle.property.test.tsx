/*
 * This oracle owns what `<Spinner … />` renders: the outer div's classes, its
 * child divs, whether the render returns, and the console output, checked on
 * the DOM after a client render. It owns `src/Spinner.tsx` and the
 * spinner table it reads in `src/spinners.ts`.
 *
 * ```jsx
 * <Spinner name="circle" />                 // → .sk-circle with 12 empty child divs
 * <Spinner name="constructor" />            // → falls back to three-bounce: .sk-three-bounce, 3 divs
 * <Spinner fadeIn="half" />                 // → exactly one fade class: sk-fade-in-half-second
 * <Spinner overrideSpinnerClassName="mine" className="x" />  // → "mine" and "x", no "sk-spinner"
 * <Spinner noFadeIn />                      // → no fade class, one deprecation warning
 * <Spinner color="red" style={{ color: 'blue', margin: '4px' }} />  // → inline color red, margin kept
 * <Spinner id="x" data-testid="t" name="pulse" />  // → id and data-testid on the div, no name attribute
 * ```
 *
 * The natural implementation looks the name up in a plain object and builds
 * the class list as a `classnames` object keyed by the props. Both treat a
 * caller's string as an object key, so `name="constructor"` finds
 * `Object.prototype.constructor` instead of "no such spinner", and
 * `className="toString"` replaces the very method `classnames` calls.
 *
 * Three parts decide the output. The spinner table maps each built-in name
 * to its class and its number of child divs; every other name falls back to
 * `three-bounce`. The fade switch turns `fadeIn` and `noFadeIn` into at most
 * one fade class. The class slots are `sk-spinner` (or the override that
 * replaces it) and the caller's `className`.
 *
 * Spinner choice: for every `name`, a built-in name gives that spinner's
 * class and exactly its number of empty child divs, and any other string, or
 * no name, gives `three-bounce`'s ("defaults to `three-bounce`", README).
 * Children a caller passes are dropped. Fade-in class: the div has exactly
 * the fade class that `fadeIn` names (`full` by default), and none for
 * `none` or when `noFadeIn` is set. Base class: `sk-spinner` when
 * `overrideSpinnerClassName` is missing or empty, and otherwise the
 * override's classes without `sk-spinner`. Your className: every class in
 * `className` is on the div. Nothing extra: the div has no class beyond
 * those four rules give. Always renders: no string in `name`, `className`,
 * or `overrideSpinnerClassName` makes the render throw. Deprecation warning:
 * `noFadeIn` gives exactly one `console.warn` that names it, and a render
 * without it logs nothing. Color: a hex or color-word `color` becomes the
 * div's inline color, over any `style.color`, and keeps every other `style`
 * entry; with no `color`, the inline style is the caller's `style`.
 * Pass-through: every other div prop reaches the div unchanged, `color`
 * stays on the div as an attribute exactly as given (decision by Kyle
 * Mathews, GitHub KyleAMathews, 2026-11-12: no breaking change), and the
 * spinner's own props never become attributes. A class the caller supplies counts as supplied,
 * so `className="sk-spinner"` beside an override is not a stray class, and a
 * class string identical to another source's appears once, as it did in
 * 3.0.0 (`className="sk-circle"` on a circle gives one `sk-circle`).
 *
 * The model computes all of this from the props alone, with its own copy of
 * the spinner table taken from SpinKit's markup and loaders.css's own div
 * table (`loaders.css.js`), so a wrong count in `src/spinners.ts` is caught
 * rather than copied. Classes are compared as `classList` tokens, split on
 * ASCII whitespace as HTML does. The histories mix the built-in names and
 * classes, every name `Object.prototype` defines, the words a missing value
 * prints as (`undefined`, `null`), and arbitrary strings. Spinner choice
 * also renders every built-in name on every run. The driver renders with
 * `createRoot` inside `act` and records the render's error, what the
 * container holds (one outer div, or nothing), the div's classes, each
 * child's markup, and every `console.warn` and `console.error` call.
 *
 * Inline styles are compared as the declarations the browser keeps, with
 * the runtime's CSS parser normalizing both sides (`#0af` is
 * `rgb(0, 170, 255)`). This file runs on React 19 and on React 18; PropTypes,
 * which only React 18 and earlier check, have their own oracle in
 * `test/react-18/`.
 *
 * Limits: `fadeIn` values outside its four (TypeScript and PropTypes reject
 * them); colors that are neither hex nor a color word, which the browser
 * drops; lone surrogates in string props; StrictMode's double construction;
 * and event handlers other than `onClick`.
 */
import * as React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import fc from 'fast-check';
import { differs, oracleProperty, pass, type Observation } from '@tanstack/oracles';

import Spinner from '../src/index';

// --- The model's spinner table --------------------------------------------
// SpinKit spinners carry `sk-<name>`; the child counts are SpinKit's markup
// (https://tobiasahlin.com/spinkit/). `wordpress` is this library's own.
const SPINKIT: ReadonlyArray<readonly [string, number]> = [
  ['circle', 12],
  ['cube-grid', 9],
  ['wave', 5],
  ['folding-cube', 4],
  ['three-bounce', 3],
  ['double-bounce', 2],
  ['wandering-cubes', 2],
  ['chasing-dots', 2],
  ['rotating-plane', 1],
  ['pulse', 1],
  ['wordpress', 1],
];
// loaders.css spinners carry their own name; the counts are the `divs` table
// in `loaders.css.js`, for the ones the README's "most of" includes.
const LOADERS: ReadonlyArray<readonly [string, number]> = [
  ['ball-grid-beat', 9],
  ['ball-grid-pulse', 9],
  ['line-spin-fade-loader', 8],
  ['ball-spin-fade-loader', 8],
  ['ball-pulse-rise', 5],
  ['line-scale', 5],
  ['line-scale-pulse-out', 5],
  ['line-scale-pulse-out-rapid', 5],
  ['pacman', 5],
  ['line-scale-party', 4],
  ['ball-triangle-path', 3],
  ['ball-scale-multiple', 3],
  ['ball-scale-ripple-multiple', 3],
  ['ball-pulse-sync', 3],
  ['ball-beat', 3],
  ['ball-zig-zag', 2],
  ['ball-zig-zag-deflect', 2],
  ['ball-clip-rotate-pulse', 2],
  ['ball-clip-rotate-multiple', 2],
  ['ball-clip-rotate', 1],
  ['ball-scale-ripple', 1],
  ['triangle-skew-spin', 1],
];
// A Map, so no caller string can reach a prototype member.
const TABLE = new Map<string, { className: string; divCount: number }>([
  ...SPINKIT.map(([name, divCount]) => [name, { className: `sk-${name}`, divCount }] as const),
  ...LOADERS.map(([name, divCount]) => [name, { className: name, divCount }] as const),
]);
const BUILT_IN_NAMES = [...TABLE.keys()];
const FALLBACK = 'three-bounce';

// README "Fades in spinners after one second"; class names from the fade tests.
const FADE_CLASS = {
  full: 'sk-fade-in',
  half: 'sk-fade-in-half-second',
  quarter: 'sk-fade-in-quarter-second',
  none: undefined,
} as const;
type FadeIn = keyof typeof FADE_CLASS;
const FADE_CLASSES = ['sk-fade-in', 'sk-fade-in-half-second', 'sk-fade-in-quarter-second'];

// Every own property name of Object.prototype (the runtime's, not production's).
const OBJECT_WORDS = [
  'constructor',
  '__defineGetter__',
  '__defineSetter__',
  'hasOwnProperty',
  '__lookupGetter__',
  '__lookupSetter__',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toString',
  'valueOf',
  '__proto__',
  'toLocaleString',
];
// How a missing value prints when something stringifies it.
const MISSING_WORDS = ['undefined', 'null'];
const CLASS_WORDS = [
  'sk-spinner',
  ...FADE_CLASSES,
  'sk-circle',
  'sk-three-bounce',
  'pacman',
  'mine',
  'mine extra',
  ' x\ty ',
  '  ',
];

// --- Histories ---------------------------------------------------------------
type ClassProp = string | null | undefined;
interface SpinnerHistory {
  name: string | undefined;
  fadeIn: FadeIn | undefined;
  noFadeIn: boolean | undefined;
  className: ClassProp;
  overrideSpinnerClassName: ClassProp;
  children: 'none' | 'text' | 'element';
  color: string | undefined;
  style: { color?: string; margin?: string } | undefined;
  attrs: { id?: string; title?: string; role?: string; 'data-testid'?: string; 'aria-label'?: string };
  onClick: boolean;
}

const anyString = fc.string({ unit: 'binary', maxLength: 12 });
const nameArb = fc.oneof(
  { arbitrary: fc.constantFrom(...BUILT_IN_NAMES), weight: 4 },
  { arbitrary: fc.constantFrom(...OBJECT_WORDS, ...MISSING_WORDS, '', 'nope'), weight: 2 },
  { arbitrary: anyString, weight: 1 },
  { arbitrary: fc.constant(undefined), weight: 1 },
);
// PropTypes accepts null for the optional string props, so JavaScript callers can pass it.
const classArb: fc.Arbitrary<ClassProp> = fc.oneof(
  { arbitrary: fc.constantFrom<ClassProp>(undefined, null, ''), weight: 3 },
  { arbitrary: fc.constantFrom(...OBJECT_WORDS, ...MISSING_WORDS, ...CLASS_WORDS), weight: 3 },
  { arbitrary: anyString, weight: 1 },
);
// README: color is "a hex value or a color word".
const COLOR_WORDS = ['red', 'blue', 'rebeccapurple', 'papayawhip', 'transparent', 'Black'];
const HEX_DIGITS = [...'0123456789abcdefABCDEF'];
const hexColor = (length: number) =>
  fc.string({ unit: fc.constantFrom(...HEX_DIGITS), minLength: length, maxLength: length }).map(
    (digits) => `#${digits}`,
    (value) => {
      if (typeof value === 'string' && new RegExp(`^#[0-9a-fA-F]{${length}}$`).test(value)) return value.slice(1);
      throw new Error(`not a ${length}-digit hex color: ${String(value)}`);
    },
  );
const colorArb = fc.oneof(
  { arbitrary: fc.constantFrom<string | undefined>(undefined, ''), weight: 2 },
  { arbitrary: fc.constantFrom(...COLOR_WORDS), weight: 2 },
  { arbitrary: hexColor(3), weight: 1 },
  { arbitrary: hexColor(6), weight: 1 },
);
const styleArb = fc.option(
  // Ordinary objects, as a caller writes them: React's style code calls
  // `hasOwnProperty`, which fast-check's default null-prototype records lack.
  fc.record(
    { color: fc.constantFrom('blue', '#123456'), margin: fc.constantFrom('4px', '0px') },
    { requiredKeys: [], noNullPrototype: true },
  ),
  { nil: undefined },
);
const attrValue = fc.string({ unit: fc.constantFrom('a', 'Z', '0', ' ', '-', '"', '&'), maxLength: 6 });
const attrsArb = fc.record(
  { id: attrValue, title: attrValue, role: attrValue, 'data-testid': attrValue, 'aria-label': attrValue },
  { requiredKeys: [], noNullPrototype: true },
);

const historyArb: fc.Arbitrary<SpinnerHistory> = fc.record({
  name: nameArb,
  fadeIn: fc.constantFrom<FadeIn | undefined>(undefined, 'full', 'half', 'quarter', 'none'),
  noFadeIn: fc.constantFrom<boolean | undefined>(undefined, false, true),
  className: classArb,
  overrideSpinnerClassName: classArb,
  children: fc.constantFrom<SpinnerHistory['children']>('none', 'text', 'element'),
  color: colorArb,
  style: styleArb,
  attrs: attrsArb,
  onClick: fc.boolean(),
});

// A history with only the given props, so a calibration's history passes clean.
const plain = (g: SpinnerHistory, props: Partial<SpinnerHistory>): SpinnerHistory => ({
  ...g,
  name: 'circle',
  className: undefined,
  overrideSpinnerClassName: undefined,
  ...props,
});

const STATES = [
  'built-in name',
  'unknown name',
  'object property name',
  'no name',
  'fade full',
  'fade half',
  'fade quarter',
  'fade none',
  'noFadeIn set',
  'override set',
  'override spelled like a missing value',
  'className set',
  'caller class repeats a built-in class',
  'class prop spelled toString',
  'children passed',
  'color set',
  'color beside style.color',
  'empty color beside style.color',
  'style without color',
  'attributes passed',
  'onClick set',
];

// Reach, from the plan alone.
function reachedWithSpinner(plan: SpinnerHistory): Array<string> {
  const states = reached(plan);
  if (plan.name !== undefined && TABLE.has(plan.name)) states.push(spinnerState(plan.name));
  return states;
}

function reached(plan: SpinnerHistory): Array<string> {
  const states: Array<string> = [];
  if (plan.name === undefined) states.push('no name');
  else if (TABLE.has(plan.name)) states.push('built-in name');
  else if (OBJECT_WORDS.includes(plan.name)) states.push('object property name');
  else states.push('unknown name');
  if (plan.noFadeIn) states.push('noFadeIn set');
  else states.push(`fade ${plan.fadeIn ?? 'full'}`);
  if (plan.overrideSpinnerClassName) states.push('override set');
  if (MISSING_WORDS.includes(plan.overrideSpinnerClassName ?? '') && !plan.className)
    states.push('override spelled like a missing value');
  if (plan.className) states.push('className set');
  const builtIns = new Set([...FADE_CLASSES, 'sk-spinner', ...[...TABLE.values()].map((s) => s.className)]);
  if ([...tokens(plan.className), ...tokens(plan.overrideSpinnerClassName)].some((c) => builtIns.has(c)))
    states.push('caller class repeats a built-in class');
  if ([plan.name, plan.className, plan.overrideSpinnerClassName].includes('toString'))
    states.push('class prop spelled toString');
  if (plan.children !== 'none') states.push('children passed');
  if (plan.color) states.push('color set');
  if (plan.color && plan.style?.color) states.push('color beside style.color');
  if (plan.color === '' && plan.style?.color) states.push('empty color beside style.color');
  if (!plan.color && plan.style) states.push('style without color');
  if (Object.keys(plan.attrs).length > 0) states.push('attributes passed');
  if (plan.onClick) states.push('onClick set');
  return states;
}

// Spinner choice speaks about every entry of the table, so each built-in name
// is its own declared state, with a constructed history that renders it.
const spinnerState = (name: string) => `spinner ${name}`;
const spinnerChoiceHistories = () => ({
  ...histories,
  states: [...STATES, ...BUILT_IN_NAMES.map(spinnerState)],
  constructed: [
    ...histories.constructed,
    ...BUILT_IN_NAMES.map((name) => ({
      name: spinnerState(name),
      enters: ['built-in name', spinnerState(name)],
      build: (g: SpinnerHistory) => plain(g, { name }),
    })),
  ],
});

const histories = {
  arbitrary: historyArb,
  states: STATES,
  runs: 100,
  fixedSeeds: [20261112],
  constructed: [
    { name: 'built-in name', enters: ['built-in name'], build: (g: SpinnerHistory) => plain(g, {}) },
    { name: 'unknown name', enters: ['unknown name'], build: (g: SpinnerHistory) => plain(g, { name: 'nope' }) },
    {
      name: 'object property name',
      enters: ['object property name'],
      build: (g: SpinnerHistory) => plain(g, { name: 'constructor' }),
    },
    { name: 'no name', enters: ['no name'], build: (g: SpinnerHistory) => plain(g, { name: undefined }) },
    {
      name: 'fade full',
      enters: ['fade full'],
      build: (g: SpinnerHistory) => plain(g, { fadeIn: undefined, noFadeIn: undefined }),
    },
    {
      name: 'fade half',
      enters: ['fade half'],
      build: (g: SpinnerHistory) => plain(g, { fadeIn: 'half', noFadeIn: undefined }),
    },
    {
      name: 'fade quarter',
      enters: ['fade quarter'],
      build: (g: SpinnerHistory) => plain(g, { fadeIn: 'quarter', noFadeIn: false }),
    },
    {
      name: 'fade none',
      enters: ['fade none'],
      build: (g: SpinnerHistory) => plain(g, { fadeIn: 'none', noFadeIn: undefined }),
    },
    { name: 'noFadeIn set', enters: ['noFadeIn set'], build: (g: SpinnerHistory) => plain(g, { noFadeIn: true }) },
    {
      name: 'override set',
      enters: ['override set'],
      build: (g: SpinnerHistory) => plain(g, { overrideSpinnerClassName: 'mine' }),
    },
    {
      name: 'override spelled like a missing value',
      enters: ['override set', 'override spelled like a missing value'],
      build: (g: SpinnerHistory) => plain(g, { overrideSpinnerClassName: 'undefined' }),
    },
    {
      name: 'className set',
      enters: ['className set'],
      build: (g: SpinnerHistory) => plain(g, { className: 'mine extra' }),
    },
    {
      name: 'caller class repeats a built-in class',
      enters: ['className set', 'override set', 'caller class repeats a built-in class'],
      build: (g: SpinnerHistory) =>
        plain(g, { className: 'sk-spinner', overrideSpinnerClassName: 'sk-fade-in', fadeIn: 'none' }),
    },
    {
      name: 'className equals the spinner class',
      enters: ['className set', 'caller class repeats a built-in class'],
      build: (g: SpinnerHistory) => plain(g, { name: 'circle', className: 'sk-circle' }),
    },
    {
      name: 'class prop spelled toString',
      enters: ['className set', 'class prop spelled toString'],
      build: (g: SpinnerHistory) => plain(g, { className: 'toString' }),
    },
    {
      name: 'children passed',
      enters: ['children passed'],
      build: (g: SpinnerHistory) => plain(g, { children: g.children === 'none' ? 'text' : g.children }),
    },
    { name: 'color set', enters: ['color set'], build: (g: SpinnerHistory) => plain(g, { color: 'red' }) },
    {
      name: 'color beside style.color',
      enters: ['color set', 'color beside style.color'],
      build: (g: SpinnerHistory) => plain(g, { color: '#0af', style: { color: 'blue', margin: '4px' } }),
    },
    {
      name: 'empty color beside style.color',
      enters: ['empty color beside style.color', 'style without color'],
      build: (g: SpinnerHistory) => plain(g, { color: '', style: { color: 'blue' } }),
    },
    {
      name: 'style without color',
      enters: ['style without color'],
      build: (g: SpinnerHistory) => plain(g, { color: undefined, style: { margin: '0px' } }),
    },
    {
      name: 'attributes passed',
      enters: ['attributes passed'],
      build: (g: SpinnerHistory) => plain(g, { attrs: { id: 'a', 'data-testid': 'Z 0', 'aria-label': '"&' } }),
    },
    { name: 'onClick set', enters: ['onClick set'], build: (g: SpinnerHistory) => plain(g, { onClick: true }) },
  ],
  fixed: [
    { name: 'name toString', history: plainFixed({ name: 'toString' }) },
    { name: 'override "null" beside className null', history: plainFixed({ className: null, overrideSpinnerClassName: 'null' }) },
  ],
};

function plainFixed(props: Partial<SpinnerHistory>): SpinnerHistory {
  return plain(
    {
      name: undefined,
      fadeIn: undefined,
      noFadeIn: undefined,
      className: undefined,
      overrideSpinnerClassName: undefined,
      children: 'none',
      color: undefined,
      style: undefined,
      attrs: {},
      onClick: false,
    },
    props,
  );
}

// --- The model -------------------------------------------------------------
// HTML splits a class attribute on ASCII whitespace.
function tokens(value: ClassProp): Array<string> {
  return value ? value.split(/[\t\n\f\r ]+/).filter(Boolean) : [];
}
const sorted = (values: Iterable<string>) => [...new Set(values)].sort();

interface Expected {
  /** Spinner choice: the chosen spinner's class and its child markup. */
  spinnerClass: string;
  children: Array<string>;
  /** Fade-in class: the fade classes the div must carry (from fadeIn, plus any the caller supplies). */
  fade: Array<string>;
  /** Base class: whether `sk-spinner` is on the div, and the override's classes. */
  skSpinner: boolean;
  overrideClasses: Array<string>;
  /** Your className. */
  callerClasses: Array<string>;
  /** Nothing extra: the exact class list. */
  classes: Array<string>;
  /** Nothing extra: the class attribute's tokens, repeats kept, sorted. */
  classTokens: Array<string>;
  /** Deprecation warning: the console calls the render owes. */
  console: Array<{ level: 'warn' | 'error'; namesNoFadeIn: boolean }>;
  /** Color: the div's inline declarations. */
  style: Record<string, string>;
  /** Pass-through: the div's attributes other than class and style, and onClick calls per click. */
  attributes: Record<string, string>;
  clicks: number;
}

// Inline declarations as the browser keeps them: the runtime's CSS parser
// (jsdom's, not production's) expands shorthands and normalizes hex colors.
function declarations(style: Record<string, string | undefined>): Record<string, string> {
  const scratch = document.createElement('div').style;
  for (const [property, value] of Object.entries(style)) if (value !== undefined) scratch.setProperty(property, value);
  return Object.fromEntries([...scratch].map((property) => [property, scratch.getPropertyValue(property)]));
}

function model(plan: SpinnerHistory): Expected {
  // Spinner choice: a built-in name, else the documented default.
  const spinner = TABLE.get(plan.name ?? FALLBACK) ?? TABLE.get(FALLBACK)!;
  // Fade-in class: noFadeIn wins; fadeIn defaults to full.
  const fadeClass = plan.noFadeIn ? undefined : FADE_CLASS[plan.fadeIn ?? 'full'];
  // Base class: an empty or missing override keeps sk-spinner.
  const overrideClasses = tokens(plan.overrideSpinnerClassName);
  const callerClasses = tokens(plan.className);
  const supplied = new Set([...overrideClasses, ...callerClasses]);
  const base = plan.overrideSpinnerClassName ? overrideClasses : ['sk-spinner'];
  const classes = sorted([...(fadeClass ? [fadeClass] : []), ...base, ...callerClasses, spinner.className]);
  // Each source is one class string; an identical string from two sources
  // appears once (3.0.0's rule), while repeats inside one string stay.
  const sources = [fadeClass, plan.overrideSpinnerClassName || 'sk-spinner', plan.className, spinner.className];
  const classTokens = [...new Set(sources.filter((source): source is string => Boolean(source)))].flatMap(tokens).sort();
  return {
    spinnerClass: spinner.className,
    children: Array.from({ length: spinner.divCount }, () => '<div></div>'),
    fade: sorted([...(fadeClass ? [fadeClass] : []), ...FADE_CLASSES.filter((c) => supplied.has(c))]),
    skSpinner: !plan.overrideSpinnerClassName || supplied.has('sk-spinner'),
    overrideClasses: sorted(overrideClasses),
    callerClasses: sorted(callerClasses),
    classes,
    classTokens,
    console: plan.noFadeIn ? [{ level: 'warn', namesNoFadeIn: true }] : [],
    // Color: a set color wins over style.color; every other style entry is kept.
    style: declarations({ ...plan.style, ...(plan.color ? { color: plan.color } : {}) }),
    // Pass-through: the caller's attributes, unchanged, and nothing of the
    // spinner's own props; color also stays on the div, as given.
    attributes: { ...plan.attrs, ...(plan.color !== undefined ? { color: plan.color } : {}) },
    clicks: plan.onClick ? 1 : 0,
  };
}

// --- The driver ------------------------------------------------------------
// React's act() needs this flag to run outside Testing Library.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function describeError(error: unknown): string {
  return error instanceof Error ? `${error.name}: ${error.message}` : String(error);
}

function driver(plan: SpinnerHistory, observe: (checkpoint: string, value: unknown) => void): void {
  const props: Record<string, unknown> = {};
  for (const key of ['name', 'fadeIn', 'noFadeIn', 'className', 'overrideSpinnerClassName'] as const)
    if (plan[key] !== undefined) props[key] = plan[key];
  if (plan.color !== undefined) props.color = plan.color;
  if (plan.style !== undefined) props.style = plan.style;
  Object.assign(props, plan.attrs);
  let clicks = 0;
  if (plan.onClick) props.onClick = () => void (clicks += 1);
  const children =
    plan.children === 'text' ? ['Loading…'] : plan.children === 'element' ? [React.createElement('span', { key: 's' }, 'Loading…')] : [];

  const logged: Array<{ level: 'warn' | 'error'; message: string }> = [];
  const { warn, error } = console;
  console.warn = (...args: Array<unknown>) => void logged.push({ level: 'warn', message: args.map(String).join(' ') });
  console.error = (...args: Array<unknown>) => void logged.push({ level: 'error', message: args.map(String).join(' ') });
  const container = document.createElement('div');
  document.body.appendChild(container);
  const thrown: Array<string> = [];
  const root = createRoot(container, {
    onUncaughtError: (e) => void thrown.push(describeError(e)),
    onCaughtError: (e) => void thrown.push(describeError(e)),
  });
  try {
    try {
      act(() => root.render(React.createElement(Spinner, props as Spinner.SpinnerProps, ...children)));
    } catch (e) {
      thrown.push(describeError(e));
    }
    observe('render', { threw: thrown[0] ?? null });
    // The root's markup, empty when nothing rendered, so a missing outer div is an observation too.
    const el = container.firstElementChild;
    observe('root', [...container.childNodes].map((n) => (n instanceof Element ? n.tagName.toLowerCase() : '#text')));
    observe('classes', el ? sorted(el.classList) : []);
    // classList collapses repeated tokens; the attribute keeps them.
    observe('class tokens', el ? tokens(el.getAttribute('class')).sort() : []);
    observe('children', el ? [...el.childNodes].map((n) => (n instanceof Element ? n.outerHTML : `#text ${n.textContent}`)) : []);
    observe('console', logged);
    const inline = (el as HTMLElement | null)?.style;
    observe('style', inline ? Object.fromEntries([...inline].map((p) => [p, inline.getPropertyValue(p)])) : {});
    observe(
      'attributes',
      el
        ? Object.fromEntries(
            [...el.attributes].filter((a) => !['class', 'style'].includes(a.name)).map((a) => [a.name, a.value]),
          )
        : {},
    );
    if (el) act(() => void (el as HTMLElement).click());
    observe('clicks', clicks);
  } finally {
    console.warn = warn;
    console.error = error;
    act(() => root.unmount());
    container.remove();
  }
}

// --- The checks ------------------------------------------------------------
function read(observations: ReadonlyArray<Observation>, checkpoint: string): unknown {
  return observations.find((o) => o.checkpoint === checkpoint)?.value;
}
// The class laws speak about a render that returned; Always renders owns a throw.
function rendered(observations: ReadonlyArray<Observation>): Array<string> | undefined {
  return (read(observations, 'render') as { threw: string | null }).threw === null
    ? (read(observations, 'classes') as Array<string>)
    : undefined;
}

const shared = { histories, model, driver, reached };

oracleProperty({
  id: 'spinner-choice',
  law: {
    statement:
      'For every name, a built-in name gives that spinner\'s class and exactly its number of empty child divs; any other string, or no name, gives three-bounce\'s. Children passed to Spinner are dropped.',
    authority:
      'README, PropTypes: "name—specify spinner to use (defaults to `three-bounce`)"; test/index.test.tsx:96 "should fall back to three-bounce for an unknown name"; child counts from SpinKit\'s markup and loaders.css.js. Children: Decision by Kyle Mathews (GitHub KyleAMathews), 2026-11-12: the spinner owns its children; children passed to it are dropped.',
    limits: 'Strings with lone surrogates are not generated.',
  },
  ...shared,
  histories: spinnerChoiceHistories(),
  reached: reachedWithSpinner,
  owns: ['src/Spinner.tsx', 'src/spinners.ts#allSpinners'],
  check: (_plan, observations, expected) => {
    const classes = rendered(observations);
    if (!classes) return pass;
    return (
      differs('root', 'spinner-choice', read(observations, 'root'), ['div'], 'the render is not one outer div') ??
      differs('classes', 'spinner-choice', classes.includes(expected.spinnerClass), true, `the div lacks the spinner class ${expected.spinnerClass}`) ??
      differs('children', 'spinner-choice', read(observations, 'children'), expected.children) ??
      pass
    );
  },
  calibrations: [
    {
      name: 'a dot goes missing',
      law: 'spinner-choice',
      history: { constructed: 'built-in name' },
      corrupt: (trace) =>
        trace.map((o) => (o.checkpoint === 'children' ? { ...o, value: (o.value as Array<string>).slice(1) } : o)),
    },
  ],
});

oracleProperty({
  id: 'fade-in-class',
  law: {
    statement:
      'For every fadeIn and noFadeIn, the div has exactly the fade class fadeIn names (full by default: sk-fade-in, half: sk-fade-in-half-second, quarter: sk-fade-in-quarter-second), and none for fadeIn="none" or when noFadeIn is set; a fade class the caller supplies is also there.',
    authority:
      'README, "Fades in spinners after one second"; test/index.test.tsx:44-70 (fadeIn behavior).',
    limits: 'fadeIn values outside full, half, quarter, and none are not generated: TypeScript and PropTypes reject them.',
  },
  ...shared,
  owns: ['src/Spinner.tsx', 'src/spinners.ts#allSpinners'],
  check: (_plan, observations, expected) => {
    const classes = rendered(observations);
    if (!classes) return pass;
    return differs('classes', 'fade-in-class', classes.filter((c) => FADE_CLASSES.includes(c)), expected.fade) ?? pass;
  },
  calibrations: [
    {
      name: 'half fades in at a full second',
      law: 'fade-in-class',
      history: { constructed: 'fade half' },
      corrupt: (trace) =>
        trace.map((o) =>
          o.checkpoint === 'classes'
            ? { ...o, value: sorted((o.value as Array<string>).map((c) => (c === 'sk-fade-in-half-second' ? 'sk-fade-in' : c))) }
            : o,
        ),
    },
  ],
});

oracleProperty({
  id: 'base-class',
  law: {
    statement:
      'For every overrideSpinnerClassName, the div has sk-spinner when the override is missing or empty, and otherwise has every class in the override and no sk-spinner (unless the caller supplies it).',
    authority:
      'README, PropTypes: "overrideSpinnerClassName—change the default `sk-spinner` className"; test/index.test.tsx:29.',
    limits: 'Strings with lone surrogates are not generated.',
  },
  ...shared,
  owns: ['src/Spinner.tsx', 'src/spinners.ts#allSpinners'],
  check: (_plan, observations, expected) => {
    const classes = rendered(observations);
    if (!classes) return pass;
    return (
      differs('classes', 'base-class', classes.includes('sk-spinner'), expected.skSpinner, expected.skSpinner ? 'sk-spinner is missing' : 'sk-spinner was not replaced') ??
      differs('classes', 'base-class', expected.overrideClasses.filter((c) => !classes.includes(c)), [], 'override classes are missing') ??
      pass
    );
  },
  calibrations: [
    {
      name: 'the override does not replace sk-spinner',
      law: 'base-class',
      history: { constructed: 'override set' },
      corrupt: (trace) =>
        trace.map((o) => (o.checkpoint === 'classes' ? { ...o, value: sorted([...(o.value as Array<string>), 'sk-spinner']) } : o)),
    },
  ],
});

oracleProperty({
  id: 'your-classname',
  law: {
    statement: 'For every className, every class in it is on the div, alongside the others.',
    authority: 'README, PropTypes: "className-add a custom classname to the outer div"; test/index.test.tsx:36.',
    limits: 'Strings with lone surrogates are not generated.',
  },
  ...shared,
  owns: ['src/Spinner.tsx', 'src/spinners.ts#allSpinners'],
  check: (_plan, observations, expected) => {
    const classes = rendered(observations);
    if (!classes) return pass;
    return differs('classes', 'your-classname', expected.callerClasses.filter((c) => !classes.includes(c)), [], 'caller classes are missing') ?? pass;
  },
  calibrations: [
    {
      name: 'the second caller class is lost',
      law: 'your-classname',
      history: { constructed: 'className set' },
      corrupt: (trace) =>
        trace.map((o) => (o.checkpoint === 'classes' ? { ...o, value: (o.value as Array<string>).filter((c) => c !== 'extra') } : o)),
    },
  ],
});

oracleProperty({
  id: 'nothing-extra',
  law: {
    statement:
      'For every combination of props, the div\'s classes are exactly the fade class, sk-spinner or the override\'s classes, the caller\'s className classes, and the spinner\'s class, and no others; a class string identical to another source\'s appears once.',
    authority:
      'README, PropTypes, which lists every source of a class on the outer div. Repeats: Decision by Kyle Mathews (GitHub KyleAMathews), 2026-11-12: no breaking changes for consumers; 3.0.0 rendered a class string that equals another source\'s once (className="sk-circle" on a circle gives one sk-circle).',
    limits: 'Strings with lone surrogates are not generated.',
  },
  ...shared,
  owns: ['src/Spinner.tsx', 'src/spinners.ts#allSpinners'],
  check: (_plan, observations, expected) => {
    const classes = rendered(observations);
    if (!classes) return pass;
    return (
      differs('classes', 'nothing-extra', classes, expected.classes) ??
      differs('class tokens', 'nothing-extra', read(observations, 'class tokens'), expected.classTokens, 'a class repeats') ??
      pass
    );
  },
  calibrations: [
    {
      name: 'a class string from two sources appears twice',
      law: 'nothing-extra',
      history: { constructed: 'className equals the spinner class' },
      corrupt: (trace) =>
        trace.map((o) => (o.checkpoint === 'class tokens' ? { ...o, value: [...(o.value as Array<string>), 'sk-circle'].sort() } : o)),
    },
    {
      name: 'a stray class',
      law: 'nothing-extra',
      history: { constructed: 'built-in name' },
      corrupt: (trace) =>
        trace.map((o) => (o.checkpoint === 'classes' ? { ...o, value: sorted([...(o.value as Array<string>), 'stray']) } : o)),
    },
  ],
});

oracleProperty({
  id: 'always-renders',
  law: {
    statement:
      'For every string name, className, and overrideSpinnerClassName (and null for the last two), rendering Spinner returns instead of throwing.',
    authority:
      'README, PropTypes: name, className, and overrideSpinnerClassName are strings, with no restriction on which; PropTypes accepts null for the optional ones.',
    limits: 'Strings with lone surrogates are not generated.',
  },
  ...shared,
  owns: ['src/Spinner.tsx', 'src/spinners.ts#allSpinners'],
  check: (_plan, observations) => differs('render', 'always-renders', read(observations, 'render'), { threw: null }) ?? pass,
  calibrations: [
    {
      name: 'the render throws',
      law: 'always-renders',
      history: { constructed: 'built-in name' },
      corrupt: (trace) =>
        trace.map((o) => (o.checkpoint === 'render' ? { ...o, value: { threw: 'TypeError: planted' } } : o)),
    },
  ],
});

oracleProperty({
  id: 'deprecation-warning',
  law: {
    statement:
      'For every render, noFadeIn set to true gives exactly one console.warn that names noFadeIn, and a render without it logs no warning or error.',
    authority: 'test/index.test.tsx:65 (noFadeIn warns); the @deprecated note on SpinnerProps.noFadeIn.',
    limits: 'StrictMode, which constructs a component twice in development, is not rendered.',
  },
  ...shared,
  owns: ['src/Spinner.tsx', 'src/spinners.ts#allSpinners'],
  check: (_plan, observations, expected) => {
    if (!rendered(observations)) return pass;
    const logged = read(observations, 'console') as Array<{ level: 'warn' | 'error'; message: string }>;
    const seen = logged.map((l) => ({ level: l.level, namesNoFadeIn: l.message.includes('noFadeIn') }));
    return differs('console', 'deprecation-warning', seen, expected.console) ?? pass;
  },
  calibrations: [
    {
      name: 'the warning is silent',
      law: 'deprecation-warning',
      history: { constructed: 'noFadeIn set' },
      corrupt: (trace) => trace.map((o) => (o.checkpoint === 'console' ? { ...o, value: [] } : o)),
    },
  ],
});

oracleProperty({
  id: 'color',
  law: {
    statement:
      'For every color that is a hex value or a CSS color word, the div\'s inline color is that color, whatever style.color says, and every other style entry is kept; with no color (missing or empty), the inline style is exactly the style passed.',
    authority:
      'README, PropTypes: "color-programmatically set the color of the spinners; this can either be a hex value or a color word"; test/index.test.tsx:74.',
    limits:
      'Colors that are neither hex nor a color word are not generated: the browser drops them. Style values are compared after the CSS parser normalizes them.',
  },
  ...shared,
  owns: ['src/Spinner.tsx', 'src/spinners.ts#allSpinners'],
  check: (_plan, observations, expected) => {
    if (!rendered(observations)) return pass;
    return differs('style', 'color', read(observations, 'style'), expected.style) ?? pass;
  },
  calibrations: [
    {
      name: 'style.color wins over color',
      law: 'color',
      history: { constructed: 'color beside style.color' },
      corrupt: (trace) =>
        trace.map((o) => (o.checkpoint === 'style' ? { ...o, value: { ...(o.value as object), color: 'blue' } } : o)),
    },
  ],
});

oracleProperty({
  id: 'pass-through',
  law: {
    statement:
      'For every other prop a div accepts (id, title, role, data-*, aria-*, onClick), the outer div carries it unchanged; color also stays on the div as an attribute, exactly as given; name, fadeIn, noFadeIn, and overrideSpinnerClassName never appear as attributes.',
    authority:
      'test/index.test.tsx:81 "should pass unknown props through to the outer div"; test/index.test.tsx:88 "should not leak spinner-specific props to the DOM". The color attribute: Decision by Kyle Mathews (GitHub KyleAMathews), 2026-11-12: keep color on the div as an attribute, so the release has no breaking change.',
    limits: 'Event handlers other than onClick are not generated.',
  },
  ...shared,
  owns: ['src/Spinner.tsx', 'src/spinners.ts#allSpinners'],
  check: (_plan, observations, expected) => {
    if (!rendered(observations)) return pass;
    return (
      differs('attributes', 'pass-through', read(observations, 'attributes'), expected.attributes) ??
      differs('clicks', 'pass-through', read(observations, 'clicks'), expected.clicks, 'onClick did not reach the div') ??
      pass
    );
  },
  calibrations: [
    {
      name: 'the spinner name leaks as an attribute',
      law: 'pass-through',
      history: { constructed: 'attributes passed' },
      corrupt: (trace) =>
        trace.map((o) => (o.checkpoint === 'attributes' ? { ...o, value: { ...(o.value as object), name: 'circle' } } : o)),
    },
  ],
});
