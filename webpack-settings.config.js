let ExtractTextPlugin = require('extract-text-webpack-plugin')
let webpack = require('webpack')
let path = require('path')
const webpackConfig = require('./webpack.config')
// delete webpackConfig.devtool
module.exports = Object.assign(webpackConfig, {
  entry: {
    wpsettings: './public/wp-settings-main',
    wpupdate: './public/bundle-update-main'
  },
  output: {
    path: path.resolve(__dirname, 'visualcomposer/resources/dist/'), // Assets dist path
    publicPath: '.', // Used to generate URL's
    filename: '[name].bundle.js', // Main bundle file
    chunkFilename: '[id].js',
    jsonpFunction: 'vcvWebpackJsonp'
  },
  plugins: [
    // new Collector(),
    new ExtractTextPlugin('[name].bundle.css'),
    new webpack.NamedModulesPlugin()
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: JSON.stringify('production')
    //   }
    // })
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
