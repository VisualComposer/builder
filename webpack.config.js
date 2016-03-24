var path = require('path');
var webpack = require('webpack');
var Collector = require('./tools/webpack-collector');
// var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  devtool: 'eval',
  entry: {
    node: './public/main',
    wp: './public/wp-main',
    app: []
  },
  output: {
    path: path.resolve(__dirname, 'public/dist/'), // Assets dist path
    publicPath: '.', // Used to generate URL's
    filename: '[name].bundle.js', // Main bundle file
    chunkFilename: '[id].js'
  },
  plugins: [
    new Collector(),
    new ExtractTextPlugin('[name].bundle.css'),
    new webpack.HotModuleReplacementPlugin()
  ],
  vc: {
    node: {
      modules: [
        'content/storage',
        'content/layout',
        'content/editor-controls',
        'content/frame-based-dnd',
        'ui/navbar',
        'ui/brand-logo',
        'ui/add-element',
        'ui/add-template',
        'ui/tree-layout',
        'ui/undo-redo',
        'ui/edit-element',
        'ui/layout-control',
        'ui/settings',
        'ui/navbar-separator',
        'ui/save-data'
      ],
      services: [
        'actions-manager',
        'asset-manager',
        'document',
        'local-storage',
        'element',
        'rules-manager',
        'shared',
        'time-machine',
        'utils'
      ]
    },
    wp: {
      modules: [
        'content/storage',
        'content/layout',
        'content/editor-controls-iframe',
        'content/atolls-dnd',
        'content/wordpress/assets',
        'content/wordpress/data-layout',
        'ui/navbar',
        'ui/brand-logo',
        'ui/add-element',
        'ui/add-template',
        'ui/tree-layout',
        'ui/undo-redo',
        'ui/edit-element',
        'ui/layout-control',
        'ui/settings',
        'ui/navbar-separator',
        'ui/wordpress-post'
      ],
      services: [
        'actions-manager',
        'asset-manager',
        'document',
        'wordpress-storage',
        'element',
        'rules-manager',
        'shared',
        'time-machine',
        'utils'
      ]
    },
  },
  module: {
    loaders: [
      {   test: /\.js$/,
        loaders: ['react-hot', 'babel'],
        exclude: /node_modules/
      },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') },
      { test: /\.less$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader') }, // use ! to chain loaders
      { test: /\.(png|jpe?g|gif)$/, loader: 'url-loader?limit=10000&name=/images/[name].[ext]?[hash]' }, // inline base64 URLs for <=8k images, direct URLs for the rest
      { test: /\.woff(2)?(\?.+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=/fonts/[name].[ext]?[hash]' },
      { test: /\.(ttf|eot|svg)(\?.+)?$/, loader: 'file-loader?name=/fonts/[name].[ext]?[hash]' },
      { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery&$=jquery' },
      // { test: require.resolve("react"), loader: "expose?React" },
      // { test: require.resolve("jquery"), loader: "expose?$!expose?jQuery" } // @todo remove on production
    ]
  }
};
