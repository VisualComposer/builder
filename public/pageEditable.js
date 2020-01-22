/* eslint-disable import/no-webpack-loader-syntax */
import './components/polyfills/index'
import './sources/less/states/common.less'
import publicAPI from './components/api/publicAPI'

// require('expose-loader?$!jquery')

if (!Object.prototype.hasOwnProperty.call(window, 'vcv')) {
  Object.defineProperty(window, 'vcv', {
    value: publicAPI,
    writable: false,
    configurable: false,
    enumerable: false
  })
}
