import ExtractTextPlugin from 'extract-text-webpack-plugin'
import webpack from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'
import VirtualModulePlugin from 'virtual-module-webpack-plugin'

import Collector from './tools/webpack-collector-4x'
import config from './webpack.config.4x.babel'
import VcWebpackCustomAliasPlugin from 'vc-webpack-vendors/webpack.plugin.customAlias'

delete config.devtool

module.exports = Object.assign({}, config, {
  mode: 'production',
  optimization: {
    minimize: true,
    runtimeChunk: false,
    namedChunks: true, // MUST BE true even for production
    namedModules: true, // MUST BE true even for production
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
      new TerserPlugin({
        terserOptions: {
          safari10: true
        }
      })
    ]
  },
  plugins: [
    new Collector({
      wp: {
        modules: [
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
          'dataProcessor',
          'modernAssetsStorage',
          'stylesManager',
          'wpMyTemplates',
          'hubCategories',
          'hubGroups',
          'hubElements',
          'elementAccessPoint',
          'hubAddons',
          'renderProcessor',
          'api'
        ]
      }
    }),
    new ExtractTextPlugin('[name].bundle.css'),
    new VirtualModulePlugin({
      moduleName: 'node_modules/jquery/dist/jquery.js',
      contents: `module.exports = window.jQuery`
    }),
    new VcWebpackCustomAliasPlugin(false, false),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
})
