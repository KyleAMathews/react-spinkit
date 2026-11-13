/*
 * This oracle owns `Spinner`'s PropTypes promise to JavaScript callers on
 * React 18 and earlier, checked on the `Failed prop type` errors that one
 * development render logs. It owns `src/Spinner.tsx` (its static `propTypes`
 * and `defaultProps`). It runs only in the React 18 Vitest project: React 19
 * no longer reads `propTypes`.
 *
 * ```jsx
 * <Spinner fadeIn="slow" />            // → one "Failed prop type" error naming fadeIn
 * <Spinner className={42} color={0} /> // → two errors: className, color
 * <Spinner name={null} />              // → one error: name is required
 * <Spinner />                          // → no error: name defaults to three-bounce
 * ```
 *
 * Why does `<Spinner />` stay quiet while `<Spinner name={null} />` does
 * not? `name` is required, and only `undefined` lets the `three-bounce`
 * default fill it in; `null` is a value, so the default never applies.
 *
 * Two parts decide the errors. The prop table states each prop's type: `name`
 * a required string, `noFadeIn` a boolean, `fadeIn` one of `full`, `half`,
 * `quarter`, `none`, and `overrideSpinnerClassName`, `className`, and `color`
 * strings. The defaults fill in `name` and `fadeIn` before the check, and
 * for every prop but `name`, `null` counts as missing.
 *
 * PropTypes warning: for every prop whose value breaks its entry in the prop
 * table, rendering on React 18 in development logs exactly one
 * `Failed prop type` error naming that prop, and a render whose props are
 * all valid logs none.
 *
 * The model reads the plan alone: for each prop, whether its value breaks its
 * entry, giving the sorted list of props owed an error. React logs each
 * distinct message once per process, so the driver renders a subclass of
 * `Spinner` with its own `displayName` for each history; the subclass
 * inherits `propTypes`, `defaultProps`, and `render` unchanged, and only the
 * component name in the message changes. The driver records the prop named
 * by each `Failed prop type` error, and the check compares that list with
 * the model's.
 *
 * Limits: other console output (React's own attribute warnings, the
 * `noFadeIn` deprecation) belongs to the main oracle; objects and arrays as
 * prop values are not generated; React 15 to 17 are not run.
 */
import { format } from 'node:util';
import * as React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import fc from 'fast-check';
import { differs, oracleProperty, pass } from '@tanstack/oracles';

import Spinner from '../../src/index';

// --- Histories ---------------------------------------------------------------
type Value = string | number | boolean | null | undefined;
interface PropTypesHistory {
  name: Value;
  noFadeIn: Value;
  fadeIn: Value;
  overrideSpinnerClassName: Value;
  className: Value;
  color: Value;
}
const PROPS = ['name', 'noFadeIn', 'fadeIn', 'overrideSpinnerClassName', 'className', 'color'] as const;

// Valid and invalid values for each prop, missing (undefined) and null included.
const stringProp = fc.constantFrom<Value>(undefined, null, '', 'x', 'circle', 0, 42, true);
const historyArb: fc.Arbitrary<PropTypesHistory> = fc.record({
  name: fc.constantFrom<Value>(undefined, null, 'circle', 'nope', 7, false),
  noFadeIn: fc.constantFrom<Value>(undefined, null, true, false, 'yes', 1),
  fadeIn: fc.constantFrom<Value>(undefined, null, 'full', 'half', 'quarter', 'none', 'slow', '', 'FULL', 1),
  overrideSpinnerClassName: stringProp,
  className: stringProp,
  color: stringProp,
});

const valid = (g: PropTypesHistory, props: Partial<PropTypesHistory>): PropTypesHistory => ({
  name: undefined,
  noFadeIn: undefined,
  fadeIn: g.fadeIn === 'slow' ? 'half' : 'quarter',
  overrideSpinnerClassName: undefined,
  className: 'x',
  color: undefined,
  ...props,
});

// --- The model ---------------------------------------------------------------
// The prop table: whether a present value breaks its entry. `undefined` is
// missing, and the defaults fill `name` and `fadeIn`; `null` is missing for
// every prop, which only the required `name` refuses.
const BREAKS: Record<(typeof PROPS)[number], (value: Value) => boolean> = {
  name: (v) => v !== undefined && typeof v !== 'string',
  noFadeIn: (v) => v != null && typeof v !== 'boolean',
  fadeIn: (v) => v != null && !['full', 'half', 'quarter', 'none'].includes(v as string),
  overrideSpinnerClassName: (v) => v != null && typeof v !== 'string',
  className: (v) => v != null && typeof v !== 'string',
  color: (v) => v != null && typeof v !== 'string',
};

function model(plan: PropTypesHistory): { failed: Array<string> } {
  return { failed: PROPS.filter((prop) => BREAKS[prop](plan[prop])).sort() };
}

function reached(plan: PropTypesHistory): Array<string> {
  const failed = model(plan).failed;
  const states = failed.length === 0 ? ['all valid'] : failed.length > 1 ? ['several invalid'] : [];
  if (plan.name === null) states.push('name null');
  else if (failed.includes('name')) states.push('name not a string');
  if (failed.includes('noFadeIn')) states.push('noFadeIn not a boolean');
  if (failed.includes('fadeIn')) states.push('fadeIn outside the four');
  if (failed.some((p) => ['overrideSpinnerClassName', 'className', 'color'].includes(p)))
    states.push('class or color not a string');
  return states;
}

// --- The driver --------------------------------------------------------------
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
let renders = 0;

function driver(plan: PropTypesHistory, observe: (checkpoint: string, value: unknown) => void): void {
  // A fresh component name per history, so React's once-per-message log
  // cannot hide a warning that an earlier history already caused.
  class FreshSpinner extends Spinner {
    static displayName = `Spinner#${(renders += 1)}`;
  }
  const props: Record<string, unknown> = {};
  for (const prop of PROPS) if (plan[prop] !== undefined) props[prop] = plan[prop];

  const errors: Array<string> = [];
  const { warn, error } = console;
  console.error = (...args: Array<unknown>) => void errors.push(format(...args));
  console.warn = () => {};
  const container = document.createElement('div');
  const root = createRoot(container);
  try {
    act(() => root.render(React.createElement(FreshSpinner, props as Spinner.SpinnerProps)));
    observe('react', React.version.split('.')[0]);
    observe(
      'failed',
      errors
        .filter((message) => message.startsWith('Warning: Failed prop type'))
        .map((message) => /prop `([^`]+)`/.exec(message)?.[1] ?? message)
        .sort(),
    );
  } finally {
    console.error = error;
    console.warn = warn;
    act(() => root.unmount());
  }
}

// --- The check ---------------------------------------------------------------
oracleProperty({
  id: 'prop-types-warning',
  law: {
    statement:
      'For every prop whose value breaks its PropTypes entry (name not a string, null counting as missing for the required name; noFadeIn not a boolean; fadeIn not one of full, half, quarter, none; overrideSpinnerClassName, className, or color not a string), rendering on React 18 in development logs exactly one Failed prop type error naming that prop; a render whose props are all valid logs none.',
    authority:
      'Decision by Kyle Mathews (GitHub KyleAMathews), 2026-11-12: keep PropTypes for React 18 and earlier. README, PropTypes.',
    limits:
      'React 18 only (React 15 to 17 are not run); objects and arrays as prop values are not generated; other console output belongs to the main oracle.',
  },
  histories: {
    arbitrary: historyArb,
    states: [
      'all valid',
      'several invalid',
      'name null',
      'name not a string',
      'noFadeIn not a boolean',
      'fadeIn outside the four',
      'class or color not a string',
    ],
    runs: 100,
    fixedSeeds: [20261112],
    constructed: [
      { name: 'all valid', enters: ['all valid'], build: (g) => valid(g, {}) },
      { name: 'name null', enters: ['name null'], build: (g) => valid(g, { name: null }) },
      { name: 'name not a string', enters: ['name not a string'], build: (g) => valid(g, { name: 7 }) },
      { name: 'noFadeIn not a boolean', enters: ['noFadeIn not a boolean'], build: (g) => valid(g, { noFadeIn: 'yes' }) },
      { name: 'fadeIn outside the four', enters: ['fadeIn outside the four'], build: (g) => valid(g, { fadeIn: 'slow' }) },
      {
        name: 'class or color not a string',
        enters: ['class or color not a string', 'several invalid'],
        build: (g) => valid(g, { className: 42, color: 0 }),
      },
    ],
  },
  model,
  reached,
  driver,
  owns: ['src/Spinner.tsx'],
  check: (_plan, observations, expected) => {
    const read = (checkpoint: string) => observations.find((o) => o.checkpoint === checkpoint)?.value;
    return (
      differs('react', 'prop-types-warning', read('react'), '18', 'this oracle must run on React 18') ??
      differs('failed', 'prop-types-warning', read('failed'), expected.failed) ??
      pass
    );
  },
  calibrations: [
    {
      name: 'an invalid fadeIn goes unreported',
      law: 'prop-types-warning',
      history: { constructed: 'fadeIn outside the four' },
      corrupt: (trace) => trace.map((o) => (o.checkpoint === 'failed' ? { ...o, value: [] } : o)),
    },
  ],
});
