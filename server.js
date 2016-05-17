var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var config = require('./webpack.config')
config.entry.app.unshift('webpack-dev-server/client?http://localhost:3000', 'webpack/hot/dev-server')

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  contentBase: './public',
  hot: true,
  historyApiFallback: false,
  /*    proxy: {
   "*": "http://localhost:9090"
   },*/
  // webpack-dev-middleware options
  quiet: false,
  noInfo: false,
  // lazy: true,
  // filename: "node.bundle.js",
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  headers: { 'X-Custom-Header': 'yes' },
  stats: { colors: true }
}).listen(3000, 'localhost', function (err, result) {
  if (err) {
    console.log(err)
  }
  console.log('Listening at localhost:3000')
})
