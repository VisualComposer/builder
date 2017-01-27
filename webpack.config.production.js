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
    app: []
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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: false,
      compress: {
        warnings: false,
        drop_console: true
      },
      output: {
        comments: false
      }
    })
  ]
})
