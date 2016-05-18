var vcCake = require('vc-cake')
require('./config/node-services')
require('./config/node-attributes')
vcCake.start(function () {
  require('./config/node-modules')
})
window.app = vcCake
window.vcvAddElement = vcCake.getService('cook').add
window.React = require('react')

require('./config/node-elements')
