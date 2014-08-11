React = require 'react'

module.exports = React.createClass

  render: ->
    switch @props.spinnerName
      when "three-bounce"
        require '../css/three-bounce.css'
        return (
          <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
        )
