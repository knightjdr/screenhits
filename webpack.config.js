const path = require('path');
const buildPath = path.join(__dirname, 'dist');
const srcPath = path.join(__dirname, 'src');

module.exports = {
  context: srcPath,
  entry: path.join(srcPath, 'client.jsx'),
  output: {
      path: buildPath,
      filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      }
    ]
  }
};
