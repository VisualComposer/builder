/* global jQuery */
import publicAPI from './resources/api/publicAPI'

window.vcv = publicAPI

jQuery(document).ready(() => {
  publicAPI.trigger('ready')
}, false)
