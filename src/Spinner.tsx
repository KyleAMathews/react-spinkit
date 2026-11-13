import PropTypes from 'prop-types';
import * as React from 'react';
import { allSpinners, type SpinnerName } from './spinners';

const noFadeInWarning =
  "Deprecation Warning (react-spinkit): noFadeIn prop should be replaced with fadeIn='none'";

// Maps, not plain objects: a caller's string must never reach an Object.prototype
// member (`constructor`, `toString`, ...). Each spinner's outer class is resolved
// here; loaders.css spinners use their name.
const spinnersByName = new Map(
  Object.entries(allSpinners).map(([name, info]) => [
    name,
    { className: info.className ?? name, divCount: info.divCount },
  ]),
);
const fallback = spinnersByName.get('three-bounce')!;
const fadeInClasses = new Map<string, string>([
  ['full', 'sk-fade-in'],
  ['half', 'sk-fade-in-half-second'],
  ['quarter', 'sk-fade-in-quarter-second'],
]);

export class Spinner extends React.Component<Spinner.SpinnerProps> {
  // Runtime validation for JavaScript users; typed loosely so the published
  // declarations don't depend on @types/prop-types.
  static propTypes: object = {
    name: PropTypes.string.isRequired,
    noFadeIn: PropTypes.bool,
    fadeIn: PropTypes.oneOf(['full', 'half', 'quarter', 'none']),
    overrideSpinnerClassName: PropTypes.string,
    className: PropTypes.string,
    color: PropTypes.string,
  };

  // `render` already treats a missing `noFadeIn` or override as off. `name`
  // stays because PropTypes marks it required (React 18 and earlier warn).
  static defaultProps = {
    name: 'three-bounce',
    fadeIn: 'full',
  } satisfies Partial<Spinner.SpinnerProps>;

  constructor(props: Spinner.SpinnerProps) {
    super(props);
    if (props.noFadeIn) {
      console.warn(noFadeInWarning);
    }
  }

  render(): React.ReactElement {
    // `color` stays in `props`, so it also reaches the div as an attribute, as
    // it always has: removing it would be a breaking change.
    const { name, fadeIn, noFadeIn, overrideSpinnerClassName, className, ...props } = this.props;
    const { className: spinnerClassName, divCount } = spinnersByName.get(String(name)) ?? fallback;
    // A list of strings, never object keys: as keys, a caller's class could
    // collide with another or shadow `toString`. A string two sources share
    // appears once, as in 3.0.0.
    const classes = [
      ...new Set([
        !noFadeIn && fadeInClasses.get(String(fadeIn)),
        overrideSpinnerClassName || 'sk-spinner',
        className,
        spinnerClassName,
      ]),
    ]
      .filter(Boolean)
      .join(' ');
    const style = props.color ? { ...props.style, color: props.color } : props.style;

    return (
      <div {...props} style={style} className={classes}>
        {Array.from({ length: divCount }, (_, idx) => (
          <div key={idx} />
        ))}
      </div>
    );
  }
}

// Type-only namespace merged with the class so the CommonJS `export =` entry
// points can expose `Spinner.SpinnerProps` etc. (matches @types/react-spinkit).
// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace Spinner {
  /** Name of a built-in spinner. */
  type Name = SpinnerName;

  /** How long to wait before fading the spinner in. */
  type FadeIn = 'full' | 'half' | 'quarter' | 'none';

  /**
   * The spinner renders its own child divs, so it takes no `children` (and no
   * `dangerouslySetInnerHTML`, which React refuses beside them).
   */
  interface SpinnerProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, 'dangerouslySetInnerHTML'> {
    children?: never;
    /** Spinner to render. Defaults to `three-bounce`. */
    name?: Name;
    /** Delay before the spinner fades in: 1s (`full`, default), 0.5s, 0.25s, or `none`. */
    fadeIn?: FadeIn;
    /** @deprecated Use `fadeIn="none"` instead. */
    noFadeIn?: boolean;
    /** Replaces the default `sk-spinner` class. */
    overrideSpinnerClassName?: string;
    /** Extra class added to the outer div. */
    className?: string;
    /** Spinner color, as a hex value or a CSS color name. */
    color?: string;
  }

  /** Kept for compatibility with `@types/react-spinkit`. */
  type Spinner = React.ComponentClass<SpinnerProps>;
}
