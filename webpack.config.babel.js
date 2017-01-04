import webpack from 'webpack'
import path from 'path'
import ServicesCollector from './tools/webpack/servicesCollector'
import ModulesCollector from './tools/webpack/modulesCollector'
import AttributesCollector from './tools/webpack/attributesCollector'
import EnvCollector from './tools/webpack/envCollector'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import autoprefixer from 'autoprefixer'
import grab from 'ps-grab'

import VirtualModulePlugin from 'virtual-module-webpack-plugin'
import ElementCollector from './tools/webpack/elementsCollector'
import ElementsBuilder from './tools/webpack/elementsBuilder'

let config = {
  // devtool: 'eval',
  entry: {
    node: './public/node-main',
    wp: './public/wp-main',
    front: './public/front-main',
    backend: './public/wpbackend-main',
    app: [],
    vendor: [
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
    path: path.resolve(__dirname, './public/dist/'), // Assets dist path
    publicPath: '.', // Used to generate URL's
    filename: '[name].bundle.js', // Main bundle file
    chunkFilename: '[id].js'
  },
  node: {
    fs: 'empty'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
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
        test: /\.css$/,
        exclude: [
          path.resolve(__dirname, './public/sources/elements')
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
  plugins: [
    new ServicesCollector(),
    new ModulesCollector(),
    new AttributesCollector(),
    new EnvCollector(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new ExtractTextPlugin('[name].bundle.css'),
    // new webpack.optimize.UglifyJsPlugin({
    //   output: {
    //     comments: false
    //   }
    // })
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],
  postcss: () => {
    return [ autoprefixer ]
  }
}

let argv = process.argv

if (argv.indexOf('--quick') === -1) {
  // Get elements and push VirtualModulePlugin
  const elements = ElementCollector.getElements()
  let single = grab('--element')
  elements.forEach((item) => {
    let elementName = item.element
    if (!single || single && single === elementName) {
      let elementPath = item.path
      let template = (ElementsBuilder.generateOutput(elementPath, {
        '--uuid': elementName,
        '--root-url': `http://test.alpha.visualcomposer.io/wp-content/plugins/vc-five/public/sources/elements/${elementName}`
      }))
      if (template) {
        config.plugins.push(
          new VirtualModulePlugin({
            moduleName: `${elementName}.js`,
            path: path.resolve(__dirname, `public/elements/${elementName}.js`),
            contents: template
          })
        )
        config.entry[ `element-${elementName}` ] = `./public/elements/${elementName}.js`
      }
    }
  })
}

module.exports = [
  config,
  {
    // devtool: 'eval',
    entry: {
      pe: './public/pe-main',
      vendor: [ 'jquery' ]
    },
    output: {
      path: path.resolve(__dirname, './public/dist/'), // Assets dist path
      publicPath: '.', // Used to generate URL's
      filename: '[name].bundle.js', // Main bundle file
      chunkFilename: '[id].js'
    },
    node: {
      fs: 'empty'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel',
          exclude: /node_modules/
        },
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
          test: /\.css$/,
          exclude: [
            path.resolve(__dirname, './public/sources/elements')
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
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.pe.bundle.js'
      }),
      new ExtractTextPlugin('[name].bundle.css')
      // new webpack.optimize.UglifyJsPlugin({
      //   output: {
      //     comments: false
      //   }
      // })
      // new webpack.HotModuleReplacementPlugin(),
    ],
    postcss: () => {
      return [ autoprefixer ]
    }
  }
]
