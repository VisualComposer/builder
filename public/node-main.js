var vcCake = require('vc-cake');
require('./config/node-services');
require('./config/node-attributes');
vcCake.start(function() {
  require('./config/node-modules');
});

require('./sources/elements-2/iconButton/iconButton');
require('./sources/elements-2/section/section');
require('./sources/elements-2/textBlock/textBlock');
require('./sources/elements-2/button/button');
window.app = vcCake;
