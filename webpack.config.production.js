let path = require('path')
let Collector = require('./tools/webpack-collector')
let ExtractTextPlugin = require('extract-text-webpack-plugin')
let webpack = require('webpack')
const webpackConfig = require('./webpack.config')
delete webpackConfig.devtool
module.exports = Object.assign(webpackConfig, {
  entry: {
    wp: './public/wp-main',
    pe: './public/pe-main',
    front: './public/front-main',
    wpbackend: './public/wpbackend-main',
    wpbackendswitch: './public/wpbackend-switch',
    // wpsettings: './public/wp-settings-main',
    // wpupdate: './public/bundle-update-main',
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
    ],
    wpPostRebuild: './public/wp-post-rebuild-main'
  },
  output: {
    path: path.resolve(__dirname, 'public/dist/'), // Assets dist path
    publicPath: '.', // Used to generate URL's
    filename: '[name].bundle.js', // Main bundle file
    chunkFilename: '[id].js'
  },
  node: {
    'fs': 'empty'
  },
  plugins: [
    new Collector(),
    new ExtractTextPlugin('[name].bundle.css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
    // new webpack.optimize.UglifyJsPlugin({
    //   minimize: true,
    //   sourceMap: false,
    //   compress: {
    //     warnings: false,
    //     drop_console: true
    //   },
    //   output: {
    //     comments: false
    //   }
    // })
  ]
})
