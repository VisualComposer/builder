import path from 'path'
import webpack from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'
import WebpackElementPlugin from './webpack.element.plugin.babel'

import config from './webpack.config.4x.babel'

const tag = __dirname.split(path.sep).pop()

delete config.devtool

module.exports = Object.assign({}, config, {
  mode: 'production',
  optimization: Object.assign({}, config.optimization, {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          safari10: true
        }
      })
    ]
  }),
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new WebpackElementPlugin(tag)
  ]
})
