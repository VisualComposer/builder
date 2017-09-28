let ExtractTextPlugin = require('extract-text-webpack-plugin')
let webpack = require('webpack')
const webpackConfig = require('./webpack-settings.config')
delete webpackConfig.devtool
module.exports = Object.assign(webpackConfig, {
  entry: {
    wpsettings: './public/wp-settings-main',
    wpupdate: './public/bundle-update-main'
  },
  plugins: [
    // new Collector(),
    new ExtractTextPlugin('[name].bundle.css'),
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
