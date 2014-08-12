var Spinner = require('../cjsx/index');
var React = require('react');

React.renderComponent(
  React.DOM.div(null,
    [
      React.DOM.h2(null, "<Spinner spinnerName='three-bounce' />"),
      Spinner({spinnerName: 'three-bounce', cssRequire: true}),
    ]), document.body);
