import React from 'react'; // eslint-disable-line import/no-extraneous-dependencies
import cx from 'classnames';
import assign from 'object-assign';
import '../css/fade-in.css';
import '../css/chasing-dots.css';
import '../css/circle.css';
import '../css/cube-grid.css';
import '../css/double-bounce.css';
import '../css/folding-cube.css';
import '../css/pulse.css';
import '../css/rotating-plane.css';
import '../css/three-bounce.css';
import '../css/wandering-cubes.css';
import '../css/wave.css';
import '../css/wordpress.css';

class Spinner extends React.Component {

  constructor(props) {
    super(props);
    this.displayName = 'SpinKit';
  }

  render() {
    const classes = cx({
      'sk-fade-in': !this.props.noFadeIn,
      'sk-spinner': this.props.overrideSpinnerClassName === '',
      [this.props.overrideSpinnerClassName]: !!this.props.overrideSpinnerClassName,
      [this.props.className]: !!this.props.className,
    });

    const props = assign({}, this.props);
    delete props.spinnerName;
    delete props.noFadeIn;
    delete props.overrideSpinnerClassName;
    delete props.className;

    let spinnerEl;
    switch (this.props.spinnerName) {
      case 'double-bounce':
        spinnerEl = (
          <div {...props} className={`sk-double-bounce ${classes}`}>
            <div className="sk-double-bounce1" />
            <div className="sk-double-bounce2" />
          </div>
        );
        break;
      case 'rotating-plane':
        spinnerEl = (
          <div {...props} className={classes}>
            <div className="sk-rotating-plane" />
          </div>
        );
        break;
      case 'wave':
        spinnerEl = (
          <div {...props} className={`sk-wave ${classes}`}>
            <div className="sk-rect1" />
            <div className="sk-rect2" />
            <div className="sk-rect3" />
            <div className="sk-rect4" />
            <div className="sk-rect5" />
          </div>
        );
        break;
      case 'wandering-cubes':
        spinnerEl = (
          <div {...props} className={`sk-wandering-cubes ${classes}`}>
            <div className="sk-cube1" />
            <div className="sk-cube2" />
          </div>
        );
        break;
      case 'pulse':
        spinnerEl = (
          <div {...props} className={classes}>
            <div className="sk-pulse" />
          </div>
        );
        break;
      case 'chasing-dots':
        spinnerEl = (
          <div {...props} className={classes}>
            <div className="sk-chasing-dots">
              <div className="sk-dot1" />
              <div className="sk-dot2" />
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
            <div className="sk-cube" />
            <div className="sk-cube" />
            <div className="sk-cube" />
            <div className="sk-cube" />
            <div className="sk-cube" />
            <div className="sk-cube" />
            <div className="sk-cube" />
            <div className="sk-cube" />
            <div className="sk-cube" />
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
            <div className="sk-wordpress">
              <div className="sk-inner-circle" />
            </div>
          </div>
        );
        break;
      case 'three-bounce':
      default:
        spinnerEl = (
          <div {...props} className={`sk-three-bounce ${classes}`}>
            <div className="sk-bounce1" />
            <div className="sk-bounce2" />
            <div className="sk-bounce3" />
          </div>
        );
    }
    return spinnerEl;
  }

}

Spinner.propTypes = {
  spinnerName: React.PropTypes.string.isRequired,
  noFadeIn: React.PropTypes.bool,
  overrideSpinnerClassName: React.PropTypes.string,
  className: React.PropTypes.string,
};

Spinner.defaultProps = {
  spinnerName: 'sk-three-bounce',
  noFadeIn: false,
  overrideSpinnerClassName: '',
};

module.exports = Spinner;
