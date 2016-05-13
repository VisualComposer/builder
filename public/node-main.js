var vcCake = require('vc-cake');
require('./config/node-services');
require('./config/node-attributes');
vcCake.start(function() {
  require('./config/node-modules');
});

require('./sources/elements-2/iconButton/element');
require('./sources/elements-2/section/element');
require('./sources/elements-2/textBlock/element');
require('./sources/elements-2/button/element');
window.app = vcCake;
