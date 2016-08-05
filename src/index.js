import React from 'react';
import cx from 'classnames';
import assign from 'object-assign';

export default class Spinner extends React.Component {
	
	constructor(props) {
		super(props);
		this.displayName = "SpinKit";
	}

  getDefaultProps() {
    return {
      spinnerName: 'three-bounce',
      noFadeIn: false,
      overrideSpinnerClassName: ""
    };
  }

  render() {
		let classes = cx({
			"fade-in": !this.props.noFadeIn,
			"spinner": this.props.overrideSpinnerClassName === "",
			[this.props.overrideSpinnerClassName]: !!this.props.overrideSpinnerClassName,
			[this.props.className]: !!this.props.className,
		});

    if (!this.props.noFadeIn) {
      require('../css/fade-in.css');
    }

    switch (this.props.spinnerName) {
      case "three-bounce":
        require('../css/three-bounce.css');
				return (
					<div className={'three-bounce ' + classes}>
						<div className="bounce1"></div>
						<div className="bounce2"></div>
						<div className="bounce3"></div>
					</div>
				);
      case "double-bounce":
        require('../css/double-bounce.css');
				return (
					<div className={'double-bounce ' + classes}>
						<div className="double-bounce1"></div>
						<div className="double-bounce2"></div>
					</div>
				);
      case "rotating-plane":
        require('../css/rotating-plane.css');
				return (
					<div className={classes}>
						<div className="rotating-plane"></div>
					</div>
				);
      case "wave":
        require('../css/wave.css');
				return (
					<div className={'wave ' + classes}>
						<div className="rect1"></div>
						<div className="rect2"></div>
						<div className="rect3"></div>
						<div className="rect4"></div>
						<div className="rect5"></div>
					</div>
				);
      case "wandering-cubes":
        require('../css/wandering-cubes.css');
				return (
					<div className={'wandering-cubes ' + classes}>
						<div className="cube1"></div>
						<div className="cube2"></div>
					</div>
				);
      case "pulse":
        require('../css/pulse.css');
				return (
					<div className={classes}>
						<div className="pulse"></div>
					</div>
				);
      case "chasing-dots":
        require('../css/chasing-dots.css');
				return (
					<div className={classes}>
						<div className="chasing-dots">
							<div className="dot1"></div>
							<div className="dot2"></div>
						</div>
					</div>
				);
      case "circle":
        require('../css/circle.css');
				return (
					<div className={'circle-wrapper ' + classes}>
						<div className="circle1 circle"></div>
						<div className="circle2 circle"></div>
						<div className="circle3 circle"></div>
						<div className="circle4 circle"></div>
						<div className="circle5 circle"></div>
						<div className="circle6 circle"></div>
						<div className="circle7 circle"></div>
						<div className="circle8 circle"></div>
						<div className="circle9 circle"></div>
						<div className="circle10 circle"></div>
						<div className="circle11 circle"></div>
						<div className="circle12 circle"></div>
					</div>
				);
      case "cube-grid":
        require('../css/cube-grid.css');
				return (
					<div className={'cube-grid ' + classes}>
						<div className="cube"></div>
						<div className="cube"></div>
						<div className="cube"></div>
						<div className="cube"></div>
						<div className="cube"></div>
						<div className="cube"></div>
						<div className="cube"></div>
						<div className="cube"></div>
						<div className="cube"></div>
					</div>
				);
      case "wordpress":
        require('../css/wordpress.css');
				return (
					<div className={classes}>
						<div className="wordpress">
							<div className="inner-circle"></div>
						</div>
					</div>
				);
    }
  }

};

Spinner.propTypes = {
	spinnerName: React.PropTypes.string.isRequired,
	noFadeIn: React.PropTypes.bool,
	overrideSpinnerClassName: React.PropTypes.string
};
