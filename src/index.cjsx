React = require 'react/addons'

module.exports = React.createClass
  displayName: "SpinKit"

  getDefaultProps: ->
    cssRequire: false
    spinnerName: 'three-bounce'
    fadeIn: false

  propTypes:
    cssRequire: React.PropTypes.bool.isRequired
    spinnerName: React.PropTypes.string.isRequired
    fadeIn: React.PropTypes.bool.isRequired

  render: ->
    cx = React.addons.classSet
    classes = cx({
      spinner: true
      "fade-in": @props.fadeIn
    })

    # Require the fade-in css.
    if @props.cssRequire and @props.fadeIn
      require '../css/fade-in.css'

    switch @props.spinnerName

      when "three-bounce"
        if @props.cssRequire
          require '../css/three-bounce.css'
        return (
          (
            <div className={classes + " three-bounce"} {... @props}>
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          )
        )

      when "double-bounce"
        if @props.cssRequire
          require '../css/double-bounce.css'
        return (
          (
            <div className={classes + " double-bounce"} {... @props}>
              <div className="double-bounce1"></div>
              <div className="double-bounce2"></div>
            </div>
          )
        )

      when "rotating-plane"
        if @props.cssRequire
          require '../css/rotating-plane.css'
        return (
          (
            <div className={classes + " rotating-plane"} {... @props}></div>
          )
        )

      when "wave"
        if @props.cssRequire
          require '../css/wave.css'
        return (
          (
            <div className={classes + " wave"} {... @props}>
              <div className="rect1"></div>
              <div className="rect2"></div>
              <div className="rect3"></div>
              <div className="rect4"></div>
              <div className="rect5"></div>
            </div>
          )
        )

      when "wandering-cubes"
        if @props.cssRequire
          require '../css/wandering-cubes.css'
        return (
          (
            <div className={classes + " wandering-cubes"} {... @props}>
              <div className="cube1"></div>
              <div className="cube2"></div>
            </div>
          )
        )

      when "pulse"
        if @props.cssRequire
          require '../css/pulse.css'
        return (
          (
            <div className={classes + " pulse"} {... @props} />
          )
        )

      when "chasing-dots"
        if @props.cssRequire
          require '../css/chasing-dots.css'
        return (
          (
            <div className={classes + " chasing-dots"} {... @props}>
              <div className="dot1"></div>
              <div className="dot2"></div>
            </div>
          )
        )

      when "circle"
        if @props.cssRequire
          require '../css/circle.css'
        return (
          (
            <div className={classes + " circle-wrapper"} {... @props}>
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
          )
        )

      when "cube-grid"
        if @props.cssRequire
          require '../css/cube-grid.css'
        return (
          (
            <div className={classes + " cube-grid"} {... @props}>
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
          )
        )

      when "wordpress"
        if @props.cssRequire
          require '../css/wordpress.css'
        return (
          (
            <div className={classes + " wordpress"} {... @props}>
              <span className="inner-circle"></span>
            </div>
          )
        )

      when "fading-circle"
        if @props.cssRequire
          require '../css/fading-circle.css'
        return (
          (
            <div className={classes + " fading-circle"} {... @props}>
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
          )
        )
