let path = require('path')
let webpack = require('webpack')
let coreConfig = require('../../../../webpack.config.refactorModule')

let vendors = coreConfig.entry.vendor
let newConfig = coreConfig
newConfig.entry = {
  element: './woocommerceAddToCart/index.js'
}
newConfig.entry.vendor = vendors
newConfig.plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor'
  }),
  new webpack.NamedModulesPlugin()
]
newConfig.output.path = path.resolve(__dirname, 'public/dist/') // Assets dist path

module.exports = newConfig
