/* global $ */
require('expose?$!jquery')
// attributes
import './sources/attributes/animateDropdown/css/animate.css'
import publicAPI from './resources/api/publicAPI'

window.vcv = publicAPI

$(document).ready(() => {
  publicAPI.trigger('ready')
}, false)
