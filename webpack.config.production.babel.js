import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import webpack from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'
import VirtualModulesPlugin from 'webpack-virtual-modules'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'

import Collector from './tools/webpack-collector-5x'
import config from './webpack.config.babel'
import VcWebpackCustomAliasPlugin from 'vc-webpack-vendors/webpack.plugin.customAlias'
import CompressionWebpackPlugin from 'compression-webpack-plugin'

const virtualModules = new VirtualModulesPlugin({
  'node_modules/jquery/dist/jquery.js': 'module.exports = window.jQuery;'
})

delete config.devtool

export default Object.assign({}, config, {
  mode: 'production',
  optimization: {
    minimize: true,
    runtimeChunk: 'single',
    mangleExports: false,
    chunkIds: 'named',
    moduleIds: 'named',
    splitChunks: {
      cacheGroups: {
        default: false,
        vendor: {
          chunks (chunk) {
            // exclude `front.bundle.js` chunk
            return chunk.name !== 'front'
          },
          name: 'vendor',
          // test: 'vendor',
          test: /[\\/]node_modules[\\/]/,
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
      new CssMinimizerPlugin()
    ]
  },
  plugins: [
    new Collector({
      wp: {
        modules: [
          'updateContent',
          'layout',
          'wordpressWorkspace',
          'insights',
          'elementLimit',
          'popups'
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
    virtualModules,
    new CompressionWebpackPlugin(),
    new VcWebpackCustomAliasPlugin(false, false),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        DEBUG: JSON.stringify('false'),
        platform: JSON.stringify('unix'),
        NODE_DEBUG: JSON.stringify('false')
      },
      'process.platform': JSON.stringify('unix'),
      'process.browser': JSON.stringify('chrome'),
      'fs.promises.readFile': JSON.stringify(false)
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    })
  ]
})
