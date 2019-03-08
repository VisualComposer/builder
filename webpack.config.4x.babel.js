import path from 'path'
import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import VirtualModulePlugin from 'virtual-module-webpack-plugin'
import VcWebpackCustomAliasPlugin from 'vc-webpack-vendors/webpack.plugin.customAlias'
import webpackVendors from 'vc-webpack-vendors'

import Collector from './tools/webpack-collector-4x'

module.exports = {
  devtool: 'eval',
  mode: 'development',
  entry: {
    wp: './public/editor',
    pe: './public/pageEditable',
    front: './public/frontView',
    wpbackendswitch: './public/backendSwitch.js',
    wpbase: './public/base',
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
    splitChunks: {
      cacheGroups: {
        default: false,
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          test: 'vendor',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new Collector({
      wp: {
        modules: [
          'updateContent',
          'layout',
          'wordpressWorkspace'
        ],
        services: [
          'utils',
          'document',
          'wordpress-post-data',
          'cook',
          'sharedAssetsLibrary',
          'elementAssetsLibrary',
          'actionsManager',
          'rulesManager',
          'api',
          'dataProcessor',
          'modernAssetsStorage',
          'stylesManager',
          'wpMyTemplates',
          'hubCategories',
          'hubGroups',
          'hubElements',
          'elementAccessPoint',
          'hubAddons',
          'renderProcessor'
        ]
      },
      'wpbackend-switcher': {
        services: [],
        modules: []
      }
    }),
    new ExtractTextPlugin('[name].bundle.css'),
    new VirtualModulePlugin({
      moduleName: 'node_modules/jquery/dist/jquery.js',
      contents: `module.exports = window.jQuery`
    }),
    new VcWebpackCustomAliasPlugin(false, true),
    new webpack.NamedModulesPlugin()
  ],
  module: {
    rules: [
      { parser: { amd: false } },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.js$/,
        use: { loader: 'babel-loader' },
        exclude: /node_modules/
        // exclude: new RegExp('node_modules\\' + path.sep + '(?!postcss-prefix-url)'),
        // query: {
        //   // https://github.com/babel/babel-loader#options
        //   cacheDirectory: true
        // }
      },
      // {
      //   test: /\.js$/,
      //   include: /node_modules/,
      //   loader: StringReplacePlugin.replace({ // from the 'string-replace-webpack-plugin'
      //     replacements: [ {
      //       pattern: /define\.amd/ig,
      //       replacement: function () {
      //         return false
      //       }
      //     } ]
      //   })
      // },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [ 'css-loader', {
            loader: 'postcss-loader',
            options: {
              plugins: () => [ require('autoprefixer')({
                browsers: [ 'ie >= 11', 'last 2 version' ]
              }) ]
            }
          }, 'less-loader' ]
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [ 'css-loader', {
            loader: 'postcss-loader',
            options: {
              plugins: () => [ require('autoprefixer')({
                browsers: [ 'ie >= 11', 'last 2 version' ]
              }) ]
            }
          }, 'less-loader' ]
        })
      },
      // use ! to chain loaders./
      { test: /\.(png|jpe?g|gif)$/, use: 'url-loader?limit=10000&name=/images/[name].[ext]?[hash]' }, // inline base64 URLs for <=8k images, direct URLs for the rest.
      { test: /\.woff(2)?(\?.+)?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff&name=/fonts/[name].[ext]?[hash]' },
      { test: /\.(ttf|eot|svg)(\?.+)?$/, use: 'file-loader?name=/fonts/[name].[ext]?[hash]' },
      { test: /\.raw(\?v=\d+\.\d+\.\d+)?$/, use: 'raw-loader' }
      // { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery&$=jquery' }
    ]
  },
  resolve: {
    alias: { 'public': path.resolve(__dirname, 'public') }
  }
}
