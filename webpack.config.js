var path = require('path')
var webpack = require('webpack')
var Collector = require('./tools/webpack-collector')
// var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var autoprefixer = require('autoprefixer')
module.exports = {
  devtool: 'eval',
  entry: {
    node: './public/node-main',
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
        'content/editor-controls-iframe',
        'content/dnd',
        'content/tree-view-dnd',
        'content/inline-editable',
        'content/local-storage/data-load',
        'content/local-storage/data-save',
        'content/local-storage/data-unload',
        'ui/layout-bar',
        'ui/navbar',
        'ui/brand-logo',
        'ui/add-element',
        'ui/edit-element',
        'ui/add-template',
        'ui/tree-view',
        'ui/undo-redo',
        'ui/layout-control',
        'ui/settings',
        'ui/navbar-separator',
        'ui/node-save'
      ],
      services: [
        'actions-manager',
        'asset-manager',
        'document',
        'local-storage',
        'cook',
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
        'content/dnd',
        'content/wordpress/assets',
        'content/wordpress/data-layout',
        'content/wordpress/data-load',
        'content/wordpress/data-save',
        'content/wordpress/data-unload',
        'content/tree-view-dnd',
        'content/inline-editable',
        'ui/layout-bar',
        'ui/navbar',
        'ui/brand-logo',
        'ui/add-element',
        'ui/edit-element',
        'ui/add-template',
        'ui/tree-view',
        'ui/undo-redo',
        'ui/layout-control',
        'ui/settings',
        'ui/navbar-separator',
        'ui/wordpress-post'
      ],
      services: [
        'actions-manager',
        'asset-manager',
        'document',
        'wordpress-post-data',
        'cook',
        'rules-manager',
        'shared',
        'time-machine',
        'utils'
      ]
    }
  },
  module: {
    loaders: [
      {
        test: require.resolve('tinymce/tinymce'),
        loaders: [
          'imports?this=>window',
          'exports?window.tinymce'
        ]
      },
      {
        test: /tinymce\/(themes|plugins)\//,
        loaders: [
          'imports?this=>window'
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          // https://github.com/babel/babel-loader#options
          cacheDirectory: true
        }
      },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader') },
      { test: /\.less$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!less-loader') }, // use ! to chain loaders.
      { test: /\.(png|jpe?g|gif)$/, loader: 'url-loader?limit=10000&name=/images/[name].[ext]?[hash]' }, // inline base64 URLs for <=8k images, direct URLs for the rest.
      { test: /\.woff(2)?(\?.+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=/fonts/[name].[ext]?[hash]' },
      { test: /\.(ttf|eot|svg)(\?.+)?$/, loader: 'file-loader?name=/fonts/[name].[ext]?[hash]' },
      { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery&$=jquery' }
      // { test: require.resolve("react"), loader: "expose?React" },
      // { test: require.resolve("jquery"), loader: "expose?$!expose?jQuery" } // TODO: Remove on production.
    ]
  },
  postcss: () => {
    return [ autoprefixer ]
  }
}
