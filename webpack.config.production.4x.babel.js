import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import webpack from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'
import VirtualModulePlugin from 'virtual-module-webpack-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'

import Collector from './tools/webpack-collector-4x'
import config from './webpack.config.4x.babel'
import VcWebpackCustomAliasPlugin from 'vc-webpack-vendors/webpack.plugin.customAlias'

delete config.devtool

export default Object.assign({}, config, {
  mode: 'production',
  optimization: {
    minimize: true,
    runtimeChunk: 'single',
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
      }),
      new OptimizeCSSAssetsPlugin()
    ]
  },
  plugins: [
    new Collector({
      wp: {
        modules: [
          'layout',
          'wordpressWorkspace',
          'insights',
          'elementLimit'
        ],
        services: [
          'dataManager',
          'utils',
          'roleManager',
          'document',
          'wordpress-post-data',
          'dataProcessor',
          'cook',
          'sharedAssetsLibrary',
          'elementAssetsLibrary',
          'actionsManager',
          'rulesManager',
          'modernAssetsStorage',
          'stylesManager',
          'wpMyTemplates',
          'hubElements',
          'elementAccessPoint',
          'hubAddons',
          'renderProcessor',
          'api'
        ]
      },
      hub: {
        services: [
          'dataManager',
          'utils',
          'roleManager',
          'document',
          'wordpress-post-data',
          'dataProcessor',
          'cook',
          'sharedAssetsLibrary',
          'elementAssetsLibrary',
          'actionsManager',
          'rulesManager',
          'modernAssetsStorage',
          'stylesManager',
          'wpMyTemplates',
          'hubElements',
          'elementAccessPoint',
          'hubAddons',
          'renderProcessor',
          'api'
        ]
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css'
    }),
    new VirtualModulePlugin({
      moduleName: 'node_modules/jquery/dist/jquery.js',
      contents: 'module.exports = window.jQuery'
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
