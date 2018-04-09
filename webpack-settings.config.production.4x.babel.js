import ExtractTextPlugin from 'extract-text-webpack-plugin'
import webpack from 'webpack'
import webpackConfig from './webpack-settings.config.4x.babel'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'
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
      new UglifyJSPlugin({
        uglifyOptions: {
          output: {
            comments: false
          }
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
    new webpack.NamedModulesPlugin()
  ]
})
