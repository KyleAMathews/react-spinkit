import React from 'react'; // eslint-disable-line import/no-extraneous-dependencies
import cx from 'classnames';
import assign from 'object-assign';

export default class Spinner extends React.Component {

  constructor(props) {
    super(props);
    this.displayName = 'SpinKit';
  }

  render() {
    const classes = cx({
      'fade-in': !this.props.noFadeIn,
      spinner: this.props.overrideSpinnerClassName === '',
      [this.props.overrideSpinnerClassName]: !!this.props.overrideSpinnerClassName,
      [this.props.className]: !!this.props.className,
    });

    const props = assign({}, this.props);
    delete props.spinnerName;
    delete props.noFadeIn;
    delete props.overrideSpinnerClassName;
    delete props.className;

    if (!this.props.noFadeIn) {
      require('../css/fade-in.css'); // eslint-disable-line global-require
    }

    // Include spinner-specific css
    require(`../css/${this.props.spinnerName}.css`); // eslint-disable-line global-require

    let spinnerEl;
    switch (this.props.spinnerName) {
      case 'double-bounce':
        spinnerEl = (
          <div {...props} className={`double-bounce ${classes}`}>
            <div className="double-bounce1" />
            <div className="double-bounce2" />
          </div>
        );
        break;
      case 'rotating-plane':
        spinnerEl = (
          <div {...props} className={classes}>
            <div className="rotating-plane" />
          </div>
        );
        break;
      case 'wave':
        spinnerEl = (
          <div {...props} className={`wave ${classes}`}>
            <div className="rect1" />
            <div className="rect2" />
            <div className="rect3" />
            <div className="rect4" />
            <div className="rect5" />
          </div>
        );
        break;
      case 'wandering-cubes':
        spinnerEl = (
          <div {...props} className={`wandering-cubes ${classes}`}>
            <div className="cube1" />
            <div className="cube2" />
          </div>
        );
        break;
      case 'pulse':
        spinnerEl = (
          <div {...props} className={classes}>
            <div className="pulse" />
          </div>
        );
        break;
      case 'chasing-dots':
        spinnerEl = (
          <div {...props} className={classes}>
            <div className="chasing-dots">
              <div className="dot1" />
              <div className="dot2" />
            </div>
          </div>
        );
        break;
      case 'circle':
        spinnerEl = (
          <div {...props} className={`circle-wrapper ${classes}`}>
            <div className="circle1 circle" />
            <div className="circle2 circle" />
            <div className="circle3 circle" />
            <div className="circle4 circle" />
            <div className="circle5 circle" />
            <div className="circle6 circle" />
            <div className="circle7 circle" />
            <div className="circle8 circle" />
            <div className="circle9 circle" />
            <div className="circle10 circle" />
            <div className="circle11 circle" />
            <div className="circle12 circle" />
          </div>
        );
        break;
      case 'cube-grid':
        spinnerEl = (
          <div {...props} className={`cube-grid ${classes}`}>
            <div className="cube" />
            <div className="cube" />
            <div className="cube" />
            <div className="cube" />
            <div className="cube" />
            <div className="cube" />
            <div className="cube" />
            <div className="cube" />
            <div className="cube" />
          </div>
        );
        break;
      case 'wordpress':
        spinnerEl = (
          <div {...props} className={classes}>
            <div className="wordpress">
              <div className="inner-circle" />
            </div>
          </div>
        );
        break;
      case 'three-bounce':
      default:
        spinnerEl = (
          <div {...props} className={`three-bounce ${classes}`}>
            <div className="bounce1" />
            <div className="bounce2" />
            <div className="bounce3" />
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
  spinnerName: 'three-bounce',
  noFadeIn: false,
  overrideSpinnerClassName: '',
};
