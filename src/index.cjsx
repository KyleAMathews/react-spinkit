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
    spinnerName: 'three-bounce'
    noFadeIn: false
    overrideSpinnerClassName: ""

  render: ->
    classTests = {
      "fade-in": not @props.noFadeIn
      spinner: @props.overrideSpinnerClassName is ""
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
            <div {... @props} className={"three-bounce " + classes}>
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
            <div {... @props} className={"double-bounce " + classes}>
              <div className="double-bounce1"></div>
              <div className="double-bounce2"></div>
            </div>
          )
        )

      when "rotating-plane"
        require '../css/rotating-plane.css'
        return (
          (
            <div {... @props} className={classes}>
              <div className={"rotating-plane"}/>
            </div>
          )
        )

      when "wave"
        require '../css/wave.css'
        return (
          (
            <div {... @props} className={"wave " + classes}>
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
            <div {... @props} className={"wandering-cubes " + classes}>
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
              <div className="pulse" />
            </div>
          )
        )

      when "chasing-dots"
        require '../css/chasing-dots.css'
        return (
          (
            <div {... @props} className={classes}>
              <div className="chasing-dots">
                <div className="dot1"></div>
                <div className="dot2"></div>
              </div>
            </div>
          )
        )

      when "circle"
        require '../css/circle.css'
        return (
          (
            <div {... @props} className={"circle-wrapper " + classes}>
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
            <div {... @props} className={"cube-grid " + classes}>
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
            <div {... @props} className={classes}>
              <div className="wordpress">
                <span className="inner-circle"></span>
              </div>
            </div>
          )
        )
