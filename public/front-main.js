/* global jQuery */
import publicAPI from './resources/api/publicAPI'

window.vcv = publicAPI

jQuery('[data-vcv-no-js]').removeAttr('data-vcv-no-js')
jQuery(document).ready(() => {
  publicAPI.trigger('ready')
}, false)
