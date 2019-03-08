import path from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import webpack from 'webpack'
import webpackConfig from './webpack.config.4x.babel'

module.exports = Object.assign({}, webpackConfig, {
  entry: {
    wpUpdate: './public/activation',
    wpVcSettings: './public/wordpressSettings'
  },
  output: {
    path: path.resolve(__dirname, 'visualcomposer/resources/dist/'), // Assets dist path
    publicPath: '.', // Used to generate URL's
    filename: '[name].bundle.js', // Main bundle file
    chunkFilename: '[name].bundle.js',
    jsonpFunction: 'vcvWebpackJsonp4x'
  },
  optimization: {
    minimize: false,
    runtimeChunk: false
  },
  plugins: [
    new ExtractTextPlugin('[name].bundle.css'),
    new webpack.NamedModulesPlugin()
  ],
  resolve: {
    alias: { 'public': path.resolve(__dirname, 'public') }
  }
})
