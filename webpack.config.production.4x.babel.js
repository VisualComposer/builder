import ExtractTextPlugin from 'extract-text-webpack-plugin'
import webpack from 'webpack'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'
import VirtualModulePlugin from 'virtual-module-webpack-plugin'

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
        uglifyOptions: {
          output: {
            comments: false
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
          'actions-manager',
          'rules-manager',
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
          'content/updateContent',
          'wordpressUpdateWorkspace'
        ],
        services: [
          'utils',
          'document',
          'wordpress-post-data',
          'cook',
          'sharedAssetsLibrary',
          'elementAssetsLibrary',
          'time-machine',
          'actions-manager',
          'rules-manager',
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
        modules: [
          'content/backendSwitcher'
        ]
      }
    }),
    new ExtractTextPlugin('[name].bundle.css'),
    new VirtualModulePlugin({
      moduleName: 'node_modules/react/react.js',
      contents: `module.exports = require('react')`
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
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
})
