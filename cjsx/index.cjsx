React = require 'react'

module.exports = React.createClass
  displayName: "SpinKit"

  getDefaultProps: ->
    cssRequire: false
    spinnerName: 'three-bounce'

  propTypes:
    cssRequire: React.PropTypes.bool
    spinnerName: React.PropTypes.string.isRequired

  render: ->
    switch @props.spinnerName
      when "three-bounce"
        if @props.cssRequire
          require '../css/three-bounce.css'
        return (
          @transferPropsTo(
            <div className="spinner three-bounce">
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
          @transferPropsTo(
            <div className="spinner double-bounce">
              <div className="double-bounce1"></div>
              <div className="double-bounce2"></div>
            </div>
          )
        )

      when "rotating-plane"
        if @props.cssRequire
          require '../css/rotating-plane.css'
        return (
          @transferPropsTo(
            <div className="spinner rotating-plane"></div>
          )
        )

      when "wave"
        if @props.cssRequire
          require '../css/wave.css'
        return (
          @transferPropsTo(
            <div className="spinner wave">
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
          @transferPropsTo(
            <div className="spinner wandering-cubes">
              <div className="cube1"></div>
              <div className="cube2"></div>
            </div>
          )
        )

      when "pulse"
        if @props.cssRequire
          require '../css/pulse.css'
        return (
          @transferPropsTo(
            <div className="spinner pulse" />
          )
        )

      when "chasing-dots"
        if @props.cssRequire
          require '../css/chasing-dots.css'
        return (
          @transferPropsTo(
            <div className="spinner chasing-dots">
              <div className="dot1"></div>
              <div className="dot2"></div>
            </div>
          )
        )

      when "circle"
        if @props.cssRequire
          require '../css/circle.css'
        return (
          @transferPropsTo(
            <div className="spinner circle-wrapper">
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
          @transferPropsTo(
            <div className="spinner cube-grid">
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
          @transferPropsTo(
            <div className="spinner wordpress">
              <span className="inner-circle"></span>
            </div>
          )
        )

      when "fading-circle"
        if @props.cssRequire
          require '../css/fading-circle.css'
        return (
          @transferPropsTo(
            <div className="spinner fading-circle">
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
