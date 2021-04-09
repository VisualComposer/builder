import path from 'path'
import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import VirtualModulePlugin from 'virtual-module-webpack-plugin'
import VcWebpackCustomAliasPlugin from 'vc-webpack-vendors/webpack.plugin.customAlias'
import webpackVendors from 'vc-webpack-vendors'
import Collector from './tools/webpack-collector-4x'

export default {
  devtool: 'eval',
  mode: 'development',
  entry: {
    wp: './public/editor',
    pe: './public/pageEditable',
    front: './public/frontView',
    wpbackendswitch: './public/backendSwitch.js',
    wpbase: './public/base',
    wpUpdate: './public/activation',
    wpVcSettings: './public/wordpressSettings',
    hub: './public/hub',
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
    fs: 'empty'
  },
  optimization: {
    minimize: false,
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
    }
  },
  plugins: [
    new Collector({
      wp: {
        modules: [
          'updateContent',
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
    new VcWebpackCustomAliasPlugin(false, true),
    new webpack.NamedModulesPlugin()
  ],
  module: {
    rules: [
      {
        parser: {
          amd: false
        }
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        },
        exclude: /node_modules/
      },
      {
        test: /\.css|\.less$/,
        exclude: [/styles\.css/, /editor\.css/],
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function plugins () {
                return [require('autoprefixer')()]
              }
            }
          },
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: 'url-loader?limit=10000&name=/images/[name].[ext]?[hash]'
      }, // inline base64 URLs for <=8k images, direct URLs for the rest.
      {
        test: /\.woff(2)?(\?.+)?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff&name=/fonts/[name].[ext]?[hash]'
      },
      {
        test: /\.svg/,
        use: {
          loader: 'svg-url-loader',
          options: {}
        }
      },
      {
        test: /\.(ttf|eot)(\?.+)?$/,
        use: 'file-loader?name=/fonts/[name].[ext]?[hash]'
      },
      {
        test: /\.raw(\?v=\d+\.\d+\.\d+)?$/,
        use: 'raw-loader' // { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery&$=jquery' }
      }
    ]
  },
  resolve: {
    alias: { public: path.resolve(__dirname, 'public') }
  }
}
