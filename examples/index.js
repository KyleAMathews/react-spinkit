var Spinner = require('../cjsx/index');
var React = require('react');

React.renderComponent(
  React.DOM.div({style:{margin:'0 auto', width: '400px'}},
    [
      React.DOM.code(null, "<Spinner spinnerName='three-bounce' />"),
      React.DOM.br(),
      React.DOM.br(),
      Spinner({spinnerName: 'three-bounce', cssRequire: true}),
      React.DOM.br(),
      React.DOM.code(null, "<Spinner spinnerName='double-bounce' />"),
      React.DOM.br(),
      React.DOM.br(),
      Spinner({spinnerName: 'double-bounce', cssRequire: true}),
      React.DOM.br(),
      React.DOM.code(null, "<Spinner spinnerName='rotating-plane' />"),
      React.DOM.br(),
      React.DOM.br(),
      Spinner({spinnerName: 'rotating-plane', cssRequire: true}),
    ]), document.body);
