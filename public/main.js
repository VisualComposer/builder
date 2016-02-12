var vcCake = require('vc-cake');
var loader = require('./lib/vc-loader');
require('./services');
vcCake.start(function() {
  // Content
  loader.loadModule('content/layout');
  loader.loadModule('content/storage');
  loader.loadModule('content/editor-controls');
  // Editor ui
  loader.loadModule('ui/navbar');
  loader.loadModule('ui/add-element');
  loader.loadModule('ui/edit-element');

  loader.loadModule('ui/tree-layout');
});
window.app = vcCake;
