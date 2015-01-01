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
If you use [Webpack](http://webpack.github.io) and the
[css-loader](https://github.com/webpack/css-loader) to build your project, then the
css for each spinner is automatically required (by adding `cssRequire` as a prop).

Otherwise, you'll need to include the necessary css for each spinner you
use from `/css`.

## Fade in spinners after one second
According to [research by Jakob Nielsen](http://www.nngroup.com/articles/response-times-3-important-limits/),
 feedback after user operations aren't necessary for about a second.
 You can set your spinner to fade in by adding the `fadeIn` prop e.g. `<Spinner
spinnerName='three-bounce' fadeIn />`

This requires `./css/fade-in.css` to be included either automatically
with Webpack or manually.


## Demo and documentation
http://kyleamathews.github.io/react-spinkit/
