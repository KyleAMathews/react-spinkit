var Spinner = require('../cjsx/index');
var React = require('react');

React.renderComponent(
  React.DOM.div(null,
    [
      React.DOM.code(null, "<Spinner spinnerName='three-bounce' />"),
      Spinner({spinnerName: 'three-bounce', cssRequire: true}),
      React.DOM.br(),
      React.DOM.code(null, "<Spinner spinnerName='double-bounce' />"),
      Spinner({spinnerName: 'double-bounce', cssRequire: true}),
    ]), document.body);
