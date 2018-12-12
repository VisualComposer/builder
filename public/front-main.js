import './polyfills'
/* global jQuery */
import publicAPI from './components/api/publicAPI'
import './sources/less/front/init.less'

if (!window.hasOwnProperty('vcv')) {
  Object.defineProperty(window, 'vcv', {
    value: publicAPI,
    writable: false,
    configurable: false,
    enumerable: false
  })
}

jQuery(document).ready(() => {
  window.vcv.trigger('ready')
}, false)
