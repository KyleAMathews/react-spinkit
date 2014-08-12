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
