import './components/polyfills/'
import publicAPI from './components/api/publicAPI'
import './sources/less/front/init.less'
if (!Object.prototype.hasOwnProperty.call(window, 'vcv')) {
  Object.defineProperty(window, 'vcv', {
    value: publicAPI,
    writable: false,
    configurable: false,
    enumerable: false
  })
}

window.jQuery(document).ready(() => {
  if (typeof window.vcvFreezeReady === 'undefined') {
    window.vcv.trigger('ready')
  }
}, false)
