import './components/polyfills/'
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

window.jQuery(document).ready(() => {
  window.vcv.trigger('ready')
}, false)
