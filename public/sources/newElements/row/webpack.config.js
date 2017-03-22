let path = require('path')
let webpack = require('webpack')
//let Collector = require('./tools/webpack-collector')
// let HtmlWebpackPlugin = require('html-webpack-plugin');
//let ExtractTextPlugin = require('extract-text-webpack-plugin')
let autoprefixer = require('autoprefixer')

module.exports = {
  devtool: 'source-map',
  entry: {
    // node: './public/node-main',
    element: './row/index.js',
    vendor: [
      'jquery',
      'react',
      'react-dom',
      'classnames',
      'lodash',
      'vc-cake',
      'babel-runtime/core-js.js',
      'babel-runtime/helpers/createClass.js',
      'babel-runtime/helpers/inherits.js',
      'babel-runtime/helpers/typeof.js',
      'babel-runtime/helpers/possibleConstructorReturn.js',
      'babel-runtime/helpers/classCallCheck.js',
      'babel-runtime/helpers/extends.js',
      'babel-runtime/core-js/symbol.js',
      'babel-runtime/core-js/symbol/iterator.js',
      'babel-runtime/core-js/object/set-prototype-of.js',
      'babel-runtime/core-js/object/get-prototype-of.js',
      'babel-runtime/core-js/object/define-property.js',
      'babel-runtime/core-js/object/create.js',
      'babel-runtime/core-js/object/assign.js',
      'babel-runtime/core-js/object/keys.js'
    ]
    // pe: './public/pe-main',
    // front: './public/front-main',
    // wpbackend: './public/wpbackend-main',
    // wpbackendswitch: './public/wpbackend-switch',
    // app: []
  },
  output: {
    path: path.resolve(__dirname, 'public/dist/'), // Assets dist path
    publicPath: 'replace-this', // Used to generate URL's
    filename: '[name].bundle.js', // Main bundle file
    chunkFilename: '[id].js'
  },
  node: {
    'fs': 'empty'
  },
  plugins: [
    // new Collector(),
    //new ExtractTextPlugin('[name].bundle.css')
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.NamedModulesPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.json$/,
        loaders: [
          'json-loader'
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          // https://github.com/babel/babel-loader#options
          cacheDirectory: true
        }
      }
    ]
  },
  postcss: () => {
    return [ autoprefixer ]
  }
}
