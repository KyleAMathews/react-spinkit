react-spinkit
=============

A collection of loading indicators animated with CSS for React

Currently I've ported all the spinner animations from
[Spinkit](https://github.com/tobiasahlin/SpinKit). If you have other favorite
 css spinner you'd like to include, open an issue.

## Install

```console
$ npm install react-spinkit --save
```

## Usage
```javascript
var Spinner = require('react-spinkit');

<Spinner spinnerName='double-bounce' />
```

See more examples on the [demo page](http://kyleamathews.github.io/react-spinkit/).

## CSS
CSS is loaded automatically when using [Webpack](http://webpack.github.io) with the
[css-loader](https://github.com/webpack/css-loader) and [style-loader](https://github.com/webpack/style-loader), or Browserify/[CSSify](https://github.com/davidguttman/cssify)
 to build your project.

## External spinners
This also includes most of the spinners from [loaders.css](https://github.com/ConnorAtherton/loaders.css): `ball-grid-beat`,
`ball-grid-pulse`, `line-spin-fade-loader`, `ball-spin-fade-loader`,
`ball-pulse-rise`, `line-scale`, `line-scale-pulse-out`,
`line-scale-pulse-out-rapid`, `line-scale-party`, `ball-triangle-path`,
`ball-scale-ripple-multiple`, `ball-pulse-sync`, `ball-beat`,
`ball-scale-multiple`, `ball-zig-zag`, `ball-zig-zag-deflect`,
`ball-clip-rotate`, `ball-clip-rotate-pulse`, `ball-clip-rotate-multiple`,
`ball-scale-ripple`, `triangle-skew-spin`, and `pacman`. Note that while
all of the native spinners from Spinkit are contained within their
bounding divs, the loaders.css spinners have a zero-sized parent div
and extend outward from that.

## Webpack or Browserify is required
Currently we only support Browserify and Webpack. If you'd like support
for other build tools that also support requiring CSS, PRs are welcome.

## Fades in spinners after one second
According to [research by Jakob Nielsen](http://www.nngroup.com/articles/response-times-3-important-limits/),
 feedback after user operations isn't necessary for about a second so by
default, react-spinkit will fade in your spinner at one second.
 You can configure spinner fade-in behavior with the `fadeIn` prop, which
 accepts values `full` (the default), `half`, `quarter`, and `none` for one
 second, a half second, a quarter second, and no fade in, respectively.
 For example: `<Spinner spinnerName='three-bounce' fadeIn='half' />`.

## PropTypes
* **spinnerName**—specify spinner to use.
* **fadeIn**-set the time before the spinner fades in.
* **overrideSpinnerClassName**—change the default "spinner" className.
* **color**-programmatically set the color of the spinners (does not work
  for circle or folding-cube); this can either be a hex value or a color word

## Server-side rendering
If you want to use this for server-side rendering, set
`process.env.REACT_SPINKIT_NO_STYLES` in your server build environment,
in webpack via `webpack.DefinePlugin`, or whatever is appropriate to your
build process. This will skip the import of styles and allow evaluation of
the SpinKit code in node.

## Demo and documentation
http://kyleamathews.github.io/react-spinkit/
