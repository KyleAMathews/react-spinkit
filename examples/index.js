var React = require('react');
var Spinner = React.createFactory(require('../src/index'));

React.render(
  React.DOM.div({style:{margin:'0 auto', width: '400px'}},
    [
      React.DOM.h1(null, "React-Spinkit"),
      React.DOM.a({href:"https://github.com/KyleAMathews/react-spinkit"}, "Browse code on Github"),
      React.DOM.br(),
      React.DOM.br(),
      React.DOM.br(),

      React.DOM.code(null, "<Spinner spinnerName='three-bounce'/>"),
      React.DOM.br(),
      React.DOM.br(),
      Spinner({spinnerName: 'three-bounce', overrideSpinnerClassName: "sk-spinner"}),

      React.DOM.br(),
      React.DOM.code(null, "<Spinner spinnerName='double-bounce'/>"),
      React.DOM.br(),
      React.DOM.br(),
      Spinner({spinnerName: 'double-bounce'}),

      React.DOM.br(),
      React.DOM.code(null, "<Spinner spinnerName='rotating-plane'/>"),
      React.DOM.br(),
      React.DOM.br(),
      Spinner({spinnerName: 'rotating-plane'}),

      React.DOM.br(),
      React.DOM.code(null, "<Spinner spinnerName='wave'/>"),
      React.DOM.br(),
      React.DOM.br(),
      Spinner({spinnerName: 'wave'}),

      React.DOM.br(),
      React.DOM.code(null, "<Spinner spinnerName='wandering-cubes'/>"),
      React.DOM.br(),
      React.DOM.br(),
      Spinner({spinnerName: 'wandering-cubes'}),

      React.DOM.br(),
      React.DOM.code(null, "<Spinner spinnerName='pulse'/>"),
      React.DOM.br(),
      React.DOM.br(),
      Spinner({spinnerName: 'pulse'}),

      React.DOM.br(),
      React.DOM.code(null, "<Spinner spinnerName='chasing-dots'/>"),
      React.DOM.br(),
      React.DOM.br(),
      Spinner({spinnerName: 'chasing-dots'}),

      React.DOM.br(),
      React.DOM.code(null, "<Spinner spinnerName='circle'/>"),
      React.DOM.br(),
      React.DOM.br(),
      Spinner({spinnerName: 'circle'}),

      React.DOM.br(),
      React.DOM.code(null, "<Spinner spinnerName='cube-grid'/>"),
      React.DOM.br(),
      React.DOM.br(),
      Spinner({spinnerName: 'cube-grid'}),

      React.DOM.br(),
      React.DOM.code(null, "<Spinner spinnerName='wordpress'/>"),
      React.DOM.br(),
      React.DOM.br(),
      Spinner({spinnerName: 'wordpress'}),

      React.DOM.br(),
      React.DOM.br(),
      React.DOM.br(),
      React.DOM.br(),
    ]), document.body);
