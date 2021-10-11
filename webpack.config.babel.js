import path from 'path'
import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import VirtualModulesPlugin from 'webpack-virtual-modules'
import VcWebpackCustomAliasPlugin from 'vc-webpack-vendors/webpack.plugin.customAlias';
import webpackVendors from 'vc-webpack-vendors';
import Collector from './tools/webpack-collector-5x';

const virtualModules = new VirtualModulesPlugin({
  'node_modules/jquery/dist/jquery.js': 'module.exports = window.jQuery;',
})

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
    vendor: webpackVendors(),
  },
  output: {
    path: path.resolve(__dirname, 'public/dist/'), // Assets dist path
    publicPath: 'auto', // Used to generate URL's
    assetModuleFilename: 'assets/[hash][ext][query]',
    filename: '[name].bundle.js', // Main bundle file
    chunkFilename: '[name].bundle.js',
    chunkLoadingGlobal: 'vcvWebpackJsonp4x',
  },
  optimization: {
    minimize: false,
    runtimeChunk: 'single',
    chunkIds: 'named',
    moduleIds: 'named',
    splitChunks: {
      cacheGroups: {
        default: false,
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          test: 'vendor',
          enforce: true,
        },
      },
    },
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
          'api',
        ],
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
          'api',
        ],
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        DEBUG: JSON.stringify('true'),
        platform: JSON.stringify('unix'),
        NODE_DEBUG: JSON.stringify('true'),
      },
      'process.platform': JSON.stringify('unix'),
      'process.browser': JSON.stringify('chrome'),
      'fs.promises.readFile': JSON.stringify(false),
    }),
    virtualModules,
    new VcWebpackCustomAliasPlugin(false, true),
  ],
  amd: false,
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css|\.less$/,
        exclude: [/styles\.css/, /editor\.css/],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: function plugins () {
                  return [require('autoprefixer')()]
                },
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                math: 'always',
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ttf|woff)$/,
        type: 'asset/resource',
      },
      // {
      //   test: /\.(png|jpe?g|gif|ttf|eof|woff)$/,
      //   use: 'url-loader?limit=20000&name=/images/[name].[ext]?[hash]',
      // }, // inline base64 URLs for <=8k images, direct URLs for the rest.
      // {
      //   test: /\.woff(2)?(\?.+)?$/,
      //   use: 'url-loader?limit=10000&mimetype=application/font-woff&name=/fonts/[name].[ext]?[hash]',
      // },
      // {
      //   test: /\.svg/,
      //   use: {
      //     loader: 'svg-url-loader',
      //     options: {},
      //   },
      // },
      // {
      //   test: /\.(ttf|eot)(\?.+)?$/,
      //   use: 'file-loader?name=/fonts/[name].[ext]?[hash]',
      // },
      {
        test: /\.raw(\?v=\d+\.\d+\.\d+)?$/,
        use: 'raw-loader', // { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery&$=jquery' }
      },
    ],
  },
  resolve: {
    alias: { public: path.resolve(__dirname, './public/') },
    fallback: {
      amd: false,
      crypto: require.resolve('crypto-browserify'),
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
      util: require.resolve('util/'),
      buffer: require.resolve('buffer/'),
      fs: require.resolve('vc-webpack-vendors/lib/slim-fs.js'),
      http: false,
      https: false,
      stream: require.resolve('stream-browserify'),
    },
  },
}
