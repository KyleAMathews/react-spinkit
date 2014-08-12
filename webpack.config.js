var path = require('path');
var webpack = require('webpack');


module.exports = {
  entry: [
    './examples/index'
  ],
	output: {
    path: path.join(__dirname, 'examples'),
		filename: 'bundle.js',
	},
	resolveLoader: {
		modulesDirectories: ['node_modules']
	},
	resolve: {
		extensions: ['', '.js', '.cjsx', '.coffee']
	},
  plugins: [
    new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'})
  ],
	module: {
		loaders: [
      { test: /\.css$/, loaders: ['style', 'css']},
      { test: /\.cjsx$/, loaders: ['coffee', 'cjsx']},
      { test: /\.coffee$/, loader: 'coffee' }
    ]
  }
};
