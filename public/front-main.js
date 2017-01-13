import $ from 'jquery'
import publicAPI from './resources/api/publicAPI'

window.vcv = publicAPI

$(document).ready(() => {
  publicAPI.trigger('ready')
}, false)
