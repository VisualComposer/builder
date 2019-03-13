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
    new ExtractTextPlugin('[name].bundle.css'),
    new webpack.NamedModulesPlugin()
  ]
})
