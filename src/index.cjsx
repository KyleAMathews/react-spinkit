React = require 'react'
cx = require 'classnames'
objectAssign = require 'react/lib/Object.assign'

module.exports = React.createClass
  displayName: "SpinKit"

  propTypes:
    spinnerName: React.PropTypes.string.isRequired
    noFadeIn: React.PropTypes.bool
    overrideSpinnerClassName: React.PropTypes.string

  getDefaultProps: ->
    spinnerName: 'sk-three-bounce'
    noFadeIn: false
    overrideSpinnerClassName: ""

  render: ->
    classTests = {
      "sk-fade-in": not @props.noFadeIn
      "sk-spinner": @props.overrideSpinnerClassName is ""
    }
    classTests[@props.overrideSpinnerClassName] = @props.overrideSpinnerClassName
    classes = cx(classTests)

    if @props.className then classes = classes + " " + @props.className

    # Require the fade-in css.
    unless @props.noFadeIn
      require '../css/fade-in.css'

    switch @props.spinnerName

      when "three-bounce"
        require '../css/three-bounce.css'
        return (
          (
            <div {... @props} className={"sk-three-bounce " + classes}>
              <div className="sk-bounce1"></div>
              <div className="sk-bounce2"></div>
              <div className="sk-bounce3"></div>
            </div>
          )
        )

      when "double-bounce"
        require '../css/double-bounce.css'
        return (
          (
            <div {... @props} className={"sk-double-bounce " + classes}>
              <div className="sk-double-bounce1"></div>
              <div className="sk-double-bounce2"></div>
            </div>
          )
        )

      when "rotating-plane"
        require '../css/rotating-plane.css'
        return (
          (
            <div {... @props} className={classes}>
              <div className={"sk-rotating-plane"}/>
            </div>
          )
        )

      when "wave"
        require '../css/wave.css'
        return (
          (
            <div {... @props} className={"sk-wave " + classes}>
              <div className="sk-rect1"></div>
              <div className="sk-rect2"></div>
              <div className="sk-rect3"></div>
              <div className="sk-rect4"></div>
              <div className="sk-rect5"></div>
            </div>
          )
        )

      when "wandering-cubes"
        require '../css/wandering-cubes.css'
        return (
          (
            <div {... @props} className={"sk-wandering-cubes " + classes}>
              <div className="cube1"></div>
              <div className="cube2"></div>
            </div>
          )
        )

      when "pulse"
        require '../css/pulse.css'
        return (
          (
            <div {... @props} className={classes}>
              <div className="sk-pulse" />
            </div>
          )
        )

      when "chasing-dots"
        require '../css/chasing-dots.css'
        return (
          (
            <div {... @props} className={classes}>
              <div className="sk-chasing-dots">
                <div className="sk-dot1"></div>
                <div className="sk-dot2"></div>
              </div>
            </div>
          )
        )

      when "circle"
        require '../css/circle.css'
        return (
          (
            <div {... @props} className={"sk-circle-wrapper " + classes}>
              <div className="sk-circle1 sk-circle"></div>
              <div className="sk-circle2 sk-circle"></div>
              <div className="sk-circle3 sk-circle"></div>
              <div className="sk-circle4 sk-circle"></div>
              <div className="sk-circle5 sk-circle"></div>
              <div className="sk-circle6 sk-circle"></div>
              <div className="sk-circle7 sk-circle"></div>
              <div className="sk-circle8 sk-circle"></div>
              <div className="sk-circle9 sk-circle"></div>
              <div className="sk-circle10 sk-circle"></div>
              <div className="sk-circle11 sk-circle"></div>
              <div className="sk-circle12 sk-circle"></div>
            </div>
          )
        )

      when "cube-grid"
        require '../css/cube-grid.css'
        return (
          (
            <div {... @props} className={"sk-cube-grid " + classes}>
              <div className="sk-cube"></div>
              <div className="sk-cube"></div>
              <div className="sk-cube"></div>
              <div className="sk-cube"></div>
              <div className="sk-cube"></div>
              <div className="sk-cube"></div>
              <div className="sk-cube"></div>
              <div className="sk-cube"></div>
              <div className="sk-cube"></div>
            </div>
          )
        )

      when "wordpress"
        require '../css/wordpress.css'
        return (
          (
            <div {... @props} className={classes}>
              <div className="sk-wordpress">
                <span className="sk-inner-circle"></span>
              </div>
            </div>
          )
        )
