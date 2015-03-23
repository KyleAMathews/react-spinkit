React = require 'react'
cx = require 'classnames'
objectAssign = require 'react/lib/Object.assign'

module.exports = React.createClass
  displayName: "SpinKit"

  getDefaultProps: ->
    spinnerName: 'three-bounce'
    fadeIn: false

  propTypes:
    spinnerName: React.PropTypes.string.isRequired
    fadeIn: React.PropTypes.bool.isRequired

  render: ->
    classes = cx({
      spinner: true
      "fade-in": @props.fadeIn
    })

    if @props.className then classes = classes + " " + @props.className

    # Require the fade-in css.
    if @props.fadeIn
      require '../css/fade-in.css'

    switch @props.spinnerName

      when "three-bounce"
        require '../css/three-bounce.css'
        return (
          (
            <div {... @props} className={classes + " three-bounce"}>
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          )
        )

      when "double-bounce"
        require '../css/double-bounce.css'
        return (
          (
            <div {... @props} className={classes + " double-bounce"}>
              <div className="double-bounce1"></div>
              <div className="double-bounce2"></div>
            </div>
          )
        )

      when "rotating-plane"
        require '../css/rotating-plane.css'
        return (
          (
            <div {... @props} className={classes + " rotating-plane"}></div>
          )
        )

      when "wave"
        require '../css/wave.css'
        return (
          (
            <div {... @props} className={classes + " wave"}>
              <div className="rect1"></div>
              <div className="rect2"></div>
              <div className="rect3"></div>
              <div className="rect4"></div>
              <div className="rect5"></div>
            </div>
          )
        )

      when "wandering-cubes"
        require '../css/wandering-cubes.css'
        return (
          (
            <div {... @props} className={classes + " wandering-cubes"}>
              <div className="cube1"></div>
              <div className="cube2"></div>
            </div>
          )
        )

      when "pulse"
        require '../css/pulse.css'
        return (
          (
            <div {... @props} className={classes + " pulse"} />
          )
        )

      when "chasing-dots"
        require '../css/chasing-dots.css'
        return (
          (
            <div {... @props} className={classes + " chasing-dots"}>
              <div className="dot1"></div>
              <div className="dot2"></div>
            </div>
          )
        )

      when "circle"
        require '../css/circle.css'
        return (
          (
            <div {... @props} className={classes + " circle-wrapper"}>
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
        require '../css/cube-grid.css'
        return (
          (
            <div {... @props} className={classes + " cube-grid"}>
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
        require '../css/wordpress.css'
        return (
          (
            <div {... @props} className={classes + " wordpress"}>
              <span className="inner-circle"></span>
            </div>
          )
        )

      when "fading-circle"
        require '../css/fading-circle.css'
        return (
          (
            <div {... @props} className={classes + " fading-circle"}>
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
