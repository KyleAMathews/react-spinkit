import PropTypes from 'prop-types';
import React from 'react'; // eslint-disable-line import/no-extraneous-dependencies
import cx from 'classnames';
import assign from 'object-assign';

if (!process.env.REACT_SPINKIT_NO_STYLES) {
  /* eslint-disable global-require */
  require('loaders.css');
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
  /* eslint-enable global-require */
}

const noFadeInWarning =
  "Deprecation Warning (react-spinkit): noFadeIn prop should be replaced with fadeIn='none'";

const nonColorizableSpinners = [
  'circle',
  'folding-cube',
];
function noColorForSpinner(spinner) {
  return `Warning (react-spinkit): color cannot be set programmatically on ${spinner} spinners`;
}

class Spinner extends React.Component {

  constructor(props) {
    if (props.noFadeIn) {
      console.warn(noFadeInWarning); // eslint-disable-line no-console
    }
    if (nonColorizableSpinners.indexOf(props.spinnerName) !== -1 && props.color) {
      console.warn(noColorForSpinner(props.spinnerName)); // eslint-disable-line no-console
    }
    super(props);
    this.displayName = 'SpinKit';
  }

  render() {
    const classes = cx({
      'sk-fade-in': this.props.fadeIn === 'full' && !this.props.noFadeIn,
      'sk-fade-in-half-second': this.props.fadeIn === 'half' && !this.props.noFadeIn,
      'sk-fade-in-quarter-second': this.props.fadeIn === 'quarter' && !this.props.noFadeIn,
      'sk-spinner': this.props.overrideSpinnerClassName === '',
      [this.props.overrideSpinnerClassName]: !!this.props.overrideSpinnerClassName,
      [this.props.className]: !!this.props.className,
    });

    const props = assign({}, this.props);
    delete props.spinnerName;
    delete props.fadeIn;
    delete props.noFadeIn;
    delete props.overrideSpinnerClassName;
    delete props.className;

    let style = { backgroundColor: this.props.color };
    let spinnerEl;
    switch (this.props.spinnerName) {
      case 'double-bounce':
        spinnerEl = (
          <div {...props} className={`sk-double-bounce ${classes}`}>
            <div className="sk-double-bounce1" style={style} />
            <div className="sk-double-bounce2" style={style} />
          </div>
        );
        break;
      case 'rotating-plane':
        spinnerEl = (
          <div {...props} className={classes}>
            <div className="sk-rotating-plane" style={style} />
          </div>
        );
        break;
      case 'wave':
        spinnerEl = (
          <div {...props} className={`sk-wave ${classes}`}>
            <div className="sk-rect1" style={style} />
            <div className="sk-rect2" style={style} />
            <div className="sk-rect3" style={style} />
            <div className="sk-rect4" style={style} />
            <div className="sk-rect5" style={style} />
          </div>
        );
        break;
      case 'wandering-cubes':
        spinnerEl = (
          <div {...props} className={`sk-wandering-cubes ${classes}`}>
            <div className="sk-cube1" style={style} />
            <div className="sk-cube2" style={style} />
          </div>
        );
        break;
      case 'pulse':
        spinnerEl = (
          <div {...props} className={classes}>
            <div className="sk-pulse" style={style} />
          </div>
        );
        break;
      case 'chasing-dots':
        spinnerEl = (
          <div {...props} className={classes}>
            <div className="sk-chasing-dots">
              <div className="sk-dot1" style={style} />
              <div className="sk-dot2" style={style} />
            </div>
          </div>
        );
        break;
      case 'circle':
        spinnerEl = (
          <div {...props} className={`sk-circle-wrapper ${classes}`}>
            <div className="sk-circle1 sk-circle" />
            <div className="sk-circle2 sk-circle" />
            <div className="sk-circle3 sk-circle" />
            <div className="sk-circle4 sk-circle" />
            <div className="sk-circle5 sk-circle" />
            <div className="sk-circle6 sk-circle" />
            <div className="sk-circle7 sk-circle" />
            <div className="sk-circle8 sk-circle" />
            <div className="sk-circle9 sk-circle" />
            <div className="sk-circle10 sk-circle" />
            <div className="sk-circle11 sk-circle" />
            <div className="sk-circle12 sk-circle" />
          </div>
        );
        break;
      case 'cube-grid':
        spinnerEl = (
          <div {...props} className={`sk-cube-grid ${classes}`}>
            <div className="sk-cube" style={style} />
            <div className="sk-cube" style={style} />
            <div className="sk-cube" style={style} />
            <div className="sk-cube" style={style} />
            <div className="sk-cube" style={style} />
            <div className="sk-cube" style={style} />
            <div className="sk-cube" style={style} />
            <div className="sk-cube" style={style} />
            <div className="sk-cube" style={style} />
          </div>
        );
        break;
      case 'folding-cube':
        spinnerEl = (
          <div {...props} className={`sk-folding-cube ${classes}`}>
            <div className="sk-cube" />
            <div className="sk-cube" />
            <div className="sk-cube" />
            <div className="sk-cube" />
          </div>
        );
        break;
      case 'wordpress':
        spinnerEl = (
          <div {...props} className={classes}>
            <div className="sk-wordpress" style={style}>
              <div className="sk-inner-circle" />
            </div>
          </div>
        );
        break;
      // the following are from loaders.css
      // 9-div simple spinners
      case 'ball-grid-beat':
      case 'ball-grid-pulse':
        spinnerEl = (
          <div {...props} className={`${this.props.spinnerName} ${classes}`}>
            <div style={style} />
            <div style={style} />
            <div style={style} />
            <div style={style} />
            <div style={style} />
            <div style={style} />
            <div style={style} />
            <div style={style} />
            <div style={style} />
          </div>
        );
        break;
      // 8-div simple spinners
      case 'line-spin-fade-loader':
      case 'ball-spin-fade-loader':
        spinnerEl = (
          <div {...props} className={`${this.props.spinnerName} ${classes}`}>
            <div style={style} />
            <div style={style} />
            <div style={style} />
            <div style={style} />
            <div style={style} />
            <div style={style} />
            <div style={style} />
            <div style={style} />
          </div>
        );
        break;
      // 5-div simple spinners
      case 'ball-pulse-rise':
      case 'line-scale':
      case 'line-scale-pulse-out':
      case 'line-scale-pulse-out-rapid':
        spinnerEl = (
          <div {...props} className={`${this.props.spinnerName} ${classes}`}>
            <div style={style} />
            <div style={style} />
            <div style={style} />
            <div style={style} />
            <div style={style} />
          </div>
        );
        break;
      // 4-div simple spinnners
      case 'line-scale-party':
        spinnerEl = (
          <div {...props} className={`${this.props.spinnerName} ${classes}`}>
            <div style={style} />
            <div style={style} />
            <div style={style} />
            <div style={style} />
          </div>
        );
        break;
      // 3-div extra-style spinners
      case 'ball-triangle-path':
      case 'ball-scale-ripple-multiple':
        style = { borderColor: this.props.color };
      // 3-div simple spinners
      case 'ball-pulse-sync':  // eslint-disable-line no-fallthrough
      case 'ball-beat':
      case 'ball-scale-multiple':
        spinnerEl = (
          <div {...props} className={`${this.props.spinnerName} ${classes}`}>
            <div style={style} />
            <div style={style} />
            <div style={style} />
          </div>
        );
        break;
      // 2-div simple spinners
      case 'ball-zig-zag':
      case 'ball-zig-zag-deflect':
        spinnerEl = (
          <div {...props} className={`${this.props.spinnerName} ${classes}`}>
            <div style={style} />
            <div style={style} />
          </div>
        );
        break;
      // other extra-styled spinners
      case 'ball-clip-rotate':
        spinnerEl = (
          <div {...props} className={`ball-clip-rotate ${classes}`}>
            <div
              style={{
                borderTopColor: this.props.color,
                borderRightColor: this.props.color,
                borderLeftColor: this.props.color,
              }}
            />
          </div>
        );
        break;
      case 'ball-clip-rotate-pulse':
        spinnerEl = (
          <div {...props} className={`ball-clip-rotate-pulse ${classes}`}>
            <div style={style} />
            <div
              style={{
                borderTopColor: this.props.color,
                borderBottomColor: this.props.color,
              }}
            />
          </div>
        );
        break;
      case 'ball-clip-rotate-multiple':
        spinnerEl = (
          <div {...props} className={`ball-clip-rotate-multiple ${classes}`}>
            <div
              style={{
                borderRightColor: this.props.color,
                borderLeftColor: this.props.color,
              }}
            />
            <div
              style={{
                borderTopColor: this.props.color,
                borderBottomColor: this.props.color,
              }}
            />
          </div>
        );
        break;
      case 'ball-scale-ripple':
        spinnerEl = (
          <div {...props} className={`ball-scale-ripple ${classes}`}>
            <div style={{ borderColor: this.props.color }} />
          </div>
        );
        break;
      case 'triangle-skew-spin':
        spinnerEl = (
          <div {...props} className={`triangle-skew-spin ${classes}`}>
            <div style={{ borderBottomColor: this.props.color }} />
          </div>
        );
        break;
      case 'pacman': // eslint-disable-line no-case-declarations
        const pacmanStyle = {
          borderTopColor: this.props.color,
          borderLeftColor: this.props.color,
          borderBottomColor: this.props.color,
        };
        spinnerEl = (
          <div {...props} className={`pacman ${classes}`}>
            <div style={pacmanStyle} />
            <div style={pacmanStyle} />
            <div style={style} />
            <div style={style} />
            <div style={style} />
          </div>
        );
        break;
      // three-bounce from this repo and default
      case 'three-bounce':
      default:
        spinnerEl = (
          <div {...props} className={`sk-three-bounce ${classes}`}>
            <div className="sk-bounce1" style={style} />
            <div className="sk-bounce2" style={style} />
            <div className="sk-bounce3" style={style} />
          </div>
        );
    }
    return spinnerEl;
  }
}

Spinner.propTypes = {
  spinnerName: PropTypes.string.isRequired,
  noFadeIn: PropTypes.bool,
  fadeIn: PropTypes.oneOf(['full', 'half', 'quarter', 'none']),
  overrideSpinnerClassName: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
};

Spinner.defaultProps = {
  spinnerName: 'sk-three-bounce',
  noFadeIn: false,
  fadeIn: 'full',
  overrideSpinnerClassName: '',
};

module.exports = Spinner;
