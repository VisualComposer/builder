import path from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import webpack from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'

module.exports = {
  mode: 'production',
  entry: {
    backgroundVideoVimeo: [ './src/vimeoPlayerApi.js', './src/plugin.js', './src/backgroundVideoVimeo.js' ]
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
    namedChunks: true, // MUST BE true even for production
    namedModules: true, // MUST BE true even for production
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          safari10: true
        }
      })
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css'
    }),
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
      {
        test: /\.css|\.less$/,
        exclude: [/styles\.css/, /editor\.css/],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function plugins () {
                return [require('autoprefixer')()];
              }
            }
          },
          'less-loader'
        ]
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
