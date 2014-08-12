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

      React.DOM.br(),
      React.DOM.code(null, "<Spinner spinnerName='wave' />"),
      React.DOM.br(),
      React.DOM.br(),
      Spinner({spinnerName: 'wave', cssRequire: true}),

      React.DOM.br(),
      React.DOM.code(null, "<Spinner spinnerName='wandering-cubes' />"),
      React.DOM.br(),
      React.DOM.br(),
      Spinner({spinnerName: 'wandering-cubes', cssRequire: true}),

      React.DOM.br(),
      React.DOM.code(null, "<Spinner spinnerName='pulse' />"),
      React.DOM.br(),
      React.DOM.br(),
      Spinner({spinnerName: 'pulse', cssRequire: true}),

      React.DOM.br(),
      React.DOM.code(null, "<Spinner spinnerName='chasing-dots' />"),
      React.DOM.br(),
      React.DOM.br(),
      Spinner({spinnerName: 'chasing-dots', cssRequire: true}),

      React.DOM.br(),
      React.DOM.code(null, "<Spinner spinnerName='circle' />"),
      React.DOM.br(),
      React.DOM.br(),
      Spinner({spinnerName: 'circle', cssRequire: true}),

      React.DOM.br(),
      React.DOM.code(null, "<Spinner spinnerName='cube-grid' />"),
      React.DOM.br(),
      React.DOM.br(),
      Spinner({spinnerName: 'cube-grid', cssRequire: true}),

      React.DOM.br(),
      React.DOM.code(null, "<Spinner spinnerName='wordpress' />"),
      React.DOM.br(),
      React.DOM.br(),
      Spinner({spinnerName: 'wordpress', cssRequire: true}),

      React.DOM.br(),
      React.DOM.br(),
      React.DOM.code(null, "<Spinner spinnerName='fading-circle' />"),
      React.DOM.br(),
      React.DOM.br(),
      Spinner({spinnerName: 'fading-circle', cssRequire: true}),

      React.DOM.br(),
      React.DOM.br(),
      React.DOM.br(),
      React.DOM.br(),
    ]), document.body);
