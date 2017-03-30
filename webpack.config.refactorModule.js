let path = require('path')
let Collector = require('./tools/webpack-collector')
// let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin')
let autoprefixer = require('autoprefixer')
let webpack = require('webpack')

module.exports = {
  devtool: 'eval',
  entry: {
    node: './public/node-main',
    wp: './public/wp-main',
    pe: './public/pe-main',
    front: './public/front-main',
    wpbackend: './public/wpbackend-main',
    wpbackendswitch: './public/wpbackend-switch',
    app: [],
    vendor: [
      'jquery',
      'react',
      'react-dom',
      'classnames',
      'lodash',
      'vc-cake',
      './node_modules/babel-runtime/core-js.js',
      './node_modules/babel-runtime/helpers/createClass.js',
      './node_modules/babel-runtime/helpers/inherits.js',
      './node_modules/babel-runtime/helpers/typeof.js',
      './node_modules/babel-runtime/helpers/possibleConstructorReturn.js',
      './node_modules/babel-runtime/helpers/classCallCheck.js',
      './node_modules/babel-runtime/helpers/extends.js',
      './node_modules/babel-runtime/core-js/symbol.js',
      './node_modules/babel-runtime/core-js/symbol/iterator.js',
      './node_modules/babel-runtime/core-js/object/set-prototype-of.js',
      './node_modules/babel-runtime/core-js/object/get-prototype-of.js',
      './node_modules/babel-runtime/core-js/object/define-property.js',
      './node_modules/babel-runtime/core-js/object/create.js',
      './node_modules/babel-runtime/core-js/object/assign.js',
      './node_modules/babel-runtime/core-js/object/keys.js'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'public/dist/'), // Assets dist path
    publicPath: '.', // Used to generate URL's
    filename: '[name].bundle.js', // Main bundle file
    chunkFilename: '[id].js'
  },
  node: {
    'fs': 'empty'
  },
  plugins: [
    new Collector(),
    new ExtractTextPlugin('[name].bundle.css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.NamedModulesPlugin()
  ],
  vc: {
    node: {
      modules: [
        'content/modernLayout',
        'workspace'
      ],
      services: [
        'utils',
        'document',
        'localStorage',
        'cook',
        'assetsLibrary',
        'actions-manager',
        'rules-manager',
        'api',
        'dataProcessor',
        'modernAssetsStorage',
        'assetsManager',
        'stylesManager',
        'myTemplates',
        'hubCategories',
        'hubGroups'
      ]
    },
    wp: {
      modules: [
        'content/modernLayout',
        'wordpressWorkspace'
      ],
      services: [
        'utils',
        'document',
        'wordpress-post-data',
        'localStorage',
        'cook',
        'assetsLibrary',
        'actions-manager',
        'rules-manager',
        'api',
        // 'categories',
        'dataProcessor',
        'modernAssetsStorage',
        'assetsManager',
        'stylesManager',
        'myTemplates',
        'hubCategories',
        'hubGroups'
      ]
    },
    wpbackend: {
      modules: [
        /*
        'content/storage',
        'content/backendAssets',
        'content/wordpress/data-load',
        'content/wordpress/data-backend-save',
        'content/wordpress/data-unload',
        'content/layout',
        'content/backendLayout',
        'ui/layoutBarBackend',
        'ui/navbarBackend',
        'ui/brand-logo',
        'ui/addElement',
        'ui/edit-element',
        'ui/addTemplate',
        'ui/undo-redo',
        'ui/settings'
        */
        'content/modernLayout',
        'content/backendLayout',
        'wordpressBackendWorkspace'
      ],
      services: [
        'utils',
        'document',
        'wordpress-post-data',
        'cook',
        'assetsLibrary',
        'time-machine',
        'actions-manager',
        'rules-manager',
        'api',
        'dataProcessor',
        'assetsStorage',
        'assetsManager',
        'stylesManager',
        'wpMyTemplates'
      ]
    },
    'wpbackend-switcher': {
      services: [],
      modules: [
        'content/backendSwitcher'
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
        test: /\.json$/,
        loaders: [
          'json-loader'
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
      {
        test: /\.css$/,
        exclude: [
          path.resolve(__dirname, './public/sources/newElements')
        ],
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader!postcss-loader'
        )
      },
      {
        test: /\.less$/,
        exclude: [
          path.resolve(__dirname, './public/sources/elements')
        ],
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader!postcss-loader!less-loader'
        )
      }, // use ! to chain loaders.
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
