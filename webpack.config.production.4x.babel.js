import ExtractTextPlugin from 'extract-text-webpack-plugin'
import webpack from 'webpack'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'
import VirtualModulePlugin from 'virtual-module-webpack-plugin'
// import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin'
// import BundleAnalyzerPlugin from 'webpack-bundle-analyzer/lib/BundleAnalyzerPlugin'

import Collector from './tools/webpack-collector-4x'
import config from './webpack.config.4x.babel'

delete config.devtool

module.exports = Object.assign({}, config, {
  mode: 'production',
  optimization: {
    minimize: true,
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
    },
    minimizer: [
      new UglifyJSPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          output: {
            comments: false
          },
          compress: false,
          ecma: 6,
          mangle: {
            safari10: true
          }
          // compress: {
          //   // unsafe_comps: true,
          //   // properties: true,
          //   // keep_fargs: false,
          //   // pure_getters: true,
          //   // collapse_vars: true,
          //   // unsafe: true,
          //   // warnings: false,
          //   // screw_ie8: true,
          //   // sequences: true,
          //   // dead_code: true,
          //   // drop_debugger: true,
          //   // comparisons: true,
          //   // conditionals: true,
          //   // evaluate: true,
          //   // booleans: true,
          //   // loops: true,
          //   // unused: true,
          //   // hoist_funs: true,
          //   // if_return: true,
          //   // join_vars: true,
          //   // cascade: true,
          //   // drop_console: true
          // }
        }
      })
    ]
  },
  plugins: [
    new Collector({
      wp: {
        modules: [
          'content/modernLayout',
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
      wpupdate: {
        modules: [
          'content/updateContent'
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
      moduleName: 'node_modules/react/react.js',
      contents: `module.exports = require('react')`
    }),
    new VirtualModulePlugin({
      moduleName: 'node_modules/jquery/dist/jquery.js',
      contents: `module.exports = window.jQuery`
    }),
    new VirtualModulePlugin({
      moduleName: 'node_modules/babel-runtime/node_modules/core-js/library/modules/web.dom.iterable.js',
      contents: `module.exports = require('core-js/library/modules/web.dom.iterable.js')`
    }),
    new VirtualModulePlugin({
      moduleName: 'node_modules/babel-runtime/node_modules/core-js/library/modules/es6.string.iterator.js',
      contents: `module.exports = require('core-js/library/modules/es6.string.iterator.js')`
    }),
    new VirtualModulePlugin({
      moduleName: 'node_modules/babel-runtime/node_modules/core-js/library/modules/core.is-iterable.js',
      contents: `module.exports = require('core-js/library/modules/core.is-iterable.js')`
    }),
    new VirtualModulePlugin({
      moduleName: 'node_modules/babel-runtime/node_modules/core-js/library/modules/es7.object.values.js',
      contents: `module.exports = require('core-js/library/modules/es7.object.values.js')`
    }),
    new VirtualModulePlugin({
      moduleName: 'node_modules/babel-runtime/node_modules/core-js/library/fn/object/values.js',
      contents: `module.exports = require('core-js/library/fn/object/values.js')`
    }),
    new VirtualModulePlugin({
      moduleName: 'node_modules/babel-runtime/node_modules/core-js/library/modules/_core.js',
      contents: `module.exports = require('core-js/library/modules/_core.js')`
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })/* ,
    new DuplicatePackageCheckerPlugin(),
    new BundleAnalyzerPlugin() */
  ]
})
