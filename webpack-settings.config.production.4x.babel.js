import ExtractTextPlugin from 'extract-text-webpack-plugin'
import webpack from 'webpack'
import webpackConfig from './webpack-settings.config.4x.babel'
import TerserPlugin from 'terser-webpack-plugin'
delete webpackConfig.devtool

module.exports = Object.assign({}, webpackConfig, {
  mode: 'production',
  optimization: {
    minimize: true,
    runtimeChunk: false,
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
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          safari10: true
        }
      })
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].bundle.css'),
    new webpack.NamedModulesPlugin()
  ]
})
