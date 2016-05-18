var vcCake = require('vc-cake')
require('./config/node-services')
require('./config/node-attributes')

window.app = vcCake
window.vcvAddElement = vcCake.getService('cook').add
window.React = require('react')

require('./config/elements')

vcCake.start(function () {
  require('./config/node-modules')
})
