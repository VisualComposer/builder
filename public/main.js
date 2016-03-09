var vcCake = require('vc-cake');
require('./node-services');
vcCake.start(function() {
  require('./node-modules');
});
window.app = vcCake;
