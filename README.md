react-spinkit
=============

A collection of loading indicators animated with CSS for React

Currently I've ported all the spinner animations from
[Spinkit](https://github.com/tobiasahlin/SpinKit). If you have other favorite
 css spinner you'd like to include, open an issue.

## Usage
```javascript
var Spinner = require('react-spinkit');

<Spinner spinnerName='double-bounce' />
```

See more examples on the [demo page](http://kyleamathews.github.io/react-spinkit/).

## CSS
CSS is loaded automatically when using [Webpack](http://webpack.github.io) and the
[css-loader](https://github.com/webpack/css-loader) or Browserify/[CSSify](https://github.com/davidguttman/cssify)
 to build your project.

## Webpack or Browserify is required
Currently we only support Browserify and Webpack. If you'd like support
for other build tools that also support requiring CSS, PRs are welcome.

## Fades in spinners after one second
According to [research by Jakob Nielsen](http://www.nngroup.com/articles/response-times-3-important-limits/),
 feedback after user operations isn't necessary for about a second so be
default, react-spinkit will fade in your spinner at one second.
 You can disable spinner fade in by adding the `noFadeIn` prop e.g. `<Spinner
spinnerName='three-bounce' noFadeIn />`

## PropTypes
* **spinnerName**—specify spinner to use.
* **noFadeIn**—disable the initial fade-in of the spinner.
* **overrideSpinnerClassName**—change the default "spinner" className.

## Demo and documentation
http://kyleamathews.github.io/react-spinkit/
