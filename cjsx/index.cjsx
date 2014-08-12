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
