var vcCake = require('vc-cake');
require('./node-services');
require('./node-attributes');
vcCake.start(function() {
  require('./node-modules');
});
window.app = vcCake;
