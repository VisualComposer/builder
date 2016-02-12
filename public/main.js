var vcCake = require('vc-cake');
var loader = require('./lib/vc-loader');
require('./services');
vcCake.start(function() {

  // Modules
  // require('./editor/content/data/storage.js');
  // require('./editor/content/layout/module.js');
});
window.app = vcCake;
