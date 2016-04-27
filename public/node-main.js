var vcCake = require('vc-cake');
require('./config/node-services');
require('./config/node-attributes');
vcCake.start(function() {
  require('./config/node-modules');
});
require('./sources/elements-2/exampleButton/exampleButton');
vcCake.getService('element-manager').get('exampleButton').component();
console.log(exports);
window.app = vcCake;

