import path from 'path'
import WebpackElementPlugin from './webpack.element.plugin.babel'
import webpackVendors from 'vc-webpack-vendors'
import webpack from 'webpack'

const tag = __dirname.split(path.sep).pop()

module.exports = Object.assign({}, {
  devtool: 'eval',
  mode: 'development',
  entry: {
    element: './' + tag + '/index.js',
    vendor: webpackVendors()
  },
  output: {
    path: path.resolve(__dirname, 'public/dist/'), // Assets dist path
    publicPath: '.', // Used to generate URL's
    filename: '[name].bundle.js', // Main bundle file
    chunkFilename: '[name].bundle.js',
    jsonpFunction: 'vcvWebpackJsonp4x'
  },
  node: {
    'fs': 'empty'
  },
  optimization: {
    minimize: false,
    runtimeChunk: false,
    namedModules: true,
    splitChunks: {
      cacheGroups: {
        default: false,
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          test: 'vendor',
          enforce: true
        },
        element: {
          chunks: 'initial',
          name: 'element',
          test: 'element',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new WebpackElementPlugin(tag)
  ],
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.js$/,
        use: { loader: 'babel-loader' },
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    alias: { 'public': path.resolve(__dirname, 'public') }
  }
})
