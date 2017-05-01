const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const buildPath = path.join(__dirname, 'dist');
const srcPath = path.join(__dirname, 'src');

module.exports = {
  context: srcPath,
  devServer: {
    historyApiFallback: true
  },
  entry: path.join(srcPath, 'client.jsx'),
  module: {
    loaders: [
      {
        test: /\.(jpe?g|png|gif)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=./images/[hash].[ext]',
          {
            loader: 'image-webpack-loader',
            query: {
              mozjpeg: {
                progressive: true,
              },
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 4,
              },
              pngquant: {
                quality: '75-90',
                speed: 3,
              }
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        exclude: /(node_modules)/,
        loader: 'eslint-loader',
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      },
      {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract('css-loader!postcss-loader!sass-loader')
      },
      {
        test: /\.(ttf|svg|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader?&name=./fonts/[hash].[ext]'
      },
      {
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader'
      },
    ]
  },
  output: {
      path: buildPath,
      filename: 'bundle.js'
  },
  plugins: [
    new ExtractTextPlugin({filename: 'bundle.css', allChunks: true})
  ]
};
