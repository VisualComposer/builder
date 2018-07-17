import path from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import webpack from 'webpack'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'

module.exports = {
  mode: 'production',
  entry: {
    backgroundVideoVimeo: ['./src/vimeoPlayerApi.js', './src/plugin.js', './src/backgroundVideoVimeo.js', './src/backgroundVideoVimeo.css']
  },
  output: {
    path: path.resolve(__dirname, 'dist/'), // Assets dist path
    publicPath: '.', // Used to generate URL's
    filename: '[name].bundle.js', // Main bundle file
    chunkFilename: '[id].js'
  },
  node: {
    'fs': 'empty'
  },
  optimization: {
    minimize: true,
    runtimeChunk: false,
    minimizer: [
      new UglifyJSPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          output: {
            comments: false
          },
          compress: false,
          ecma: 6,
          mangle: true
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
    new ExtractTextPlugin('[name].bundle.css'),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],
  module: {
    rules: [
      { parser: { amd: false } },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      // {
      //   test: /\.js$/,
      //   use: { loader: 'babel-loader' },
      //   exclude: /node_modules/
      //   // exclude: new RegExp('node_modules\\' + path.sep + '(?!postcss-prefix-url)'),
      //   // query: {
      //   //   // https://github.com/babel/babel-loader#options
      //   //   cacheDirectory: true
      //   // }
      // },
      // {
      //   test: /\.js$/,
      //   include: /node_modules/,
      //   loader: StringReplacePlugin.replace({ // from the 'string-replace-webpack-plugin'
      //     replacements: [ {
      //       pattern: /define\.amd/ig,
      //       replacement: function () {
      //         return false
      //       }
      //     } ]
      //   })
      // },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [ 'css-loader', {
            loader: 'postcss-loader',
            options: {
              plugins: () => [ require('autoprefixer')({
                browsers: [ 'ie >= 11', 'last 2 version' ]
              }) ]
            }
          } ]
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [ 'css-loader', {
            loader: 'postcss-loader',
            options: {
              plugins: () => [ require('autoprefixer')({
                browsers: [ 'ie >= 11', 'last 2 version' ]
              }) ]
            }
          }, 'less-loader' ]
        })
      },
      // use ! to chain loaders./
      { test: /\.(png|jpe?g|gif)$/, use: 'url-loader?limit=10000&name=/images/[name].[ext]?[hash]' }, // inline base64 URLs for <=8k images, direct URLs for the rest.
      { test: /\.woff(2)?(\?.+)?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff&name=/fonts/[name].[ext]?[hash]' },
      { test: /\.(ttf|eot|svg)(\?.+)?$/, use: 'file-loader?name=/fonts/[name].[ext]?[hash]' },
      { test: /\.raw(\?v=\d+\.\d+\.\d+)?$/, use: 'raw-loader' }
      // { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery&$=jquery' }
    ]
  }
}
