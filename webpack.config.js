const path = require('path');

module.exports = {
  entry: [
    './examples/index.jsx',
  ],
  devServer: {
    contentBase: './examples/',
    hot: true,
  },
  output: {
    path: path.join(__dirname, 'examples'),
    filename: 'bundle.js',
  },
  resolveLoader: {
    modulesDirectories: ['node_modules'],
  },
  resolve: {
    extensions: ['', '.js'],
  },
  plugins: [
  ],
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
      },
      {
        test: /\.jsx?$/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react'],
        },
      },
    ],
  },
};
