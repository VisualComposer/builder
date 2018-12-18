/* eslint-disable import/no-webpack-loader-syntax */
import './components/polyfills/index'
import 'medium-editor/dist/css/medium-editor.css'
import './sources/less/states/comon.less'
import publicAPI from './components/api/publicAPI'

require('expose-loader?$!jquery')

if (!window.hasOwnProperty('vcv')) {
  Object.defineProperty(window, 'vcv', {
    value: publicAPI,
    writable: false,
    configurable: false,
    enumerable: false
  })
}
