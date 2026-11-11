import PropTypes from 'prop-types';
import * as React from 'react';
import cx from 'classnames';
import { allSpinners, type SpinnerInfo, type SpinnerName } from './spinners';

const noFadeInWarning =
  "Deprecation Warning (react-spinkit): noFadeIn prop should be replaced with fadeIn='none'";

const spinnersByName: Record<string, SpinnerInfo | undefined> = allSpinners;

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

  static defaultProps = {
    name: 'three-bounce',
    noFadeIn: false,
    fadeIn: 'full',
    overrideSpinnerClassName: '',
  } satisfies Partial<Spinner.SpinnerProps>;

  constructor(props: Spinner.SpinnerProps) {
    super(props);
    if (props.noFadeIn) {
      console.warn(noFadeInWarning);
    }
  }

  render(): React.ReactElement {
    // `color` deliberately stays in `props`: it has always been passed through to the div.
    const { name, fadeIn, noFadeIn, overrideSpinnerClassName, className, ...props } = this.props;
    const spinnerInfo = spinnersByName[String(name)] || allSpinners['three-bounce'];
    const classes = cx({
      'sk-fade-in': fadeIn === 'full' && !noFadeIn,
      'sk-fade-in-half-second': fadeIn === 'half' && !noFadeIn,
      'sk-fade-in-quarter-second': fadeIn === 'quarter' && !noFadeIn,
      'sk-spinner': !overrideSpinnerClassName,
      [String(overrideSpinnerClassName)]: !!overrideSpinnerClassName,
      [String(className)]: !!className,
      [String(spinnerInfo.className || name)]: true,
    });
    const style = props.color ? { ...props.style, color: props.color } : props.style;

    return (
      <div {...props} style={style} className={classes}>
        {Array.from({ length: spinnerInfo.divCount }, (_, idx) => (
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

  interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
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
