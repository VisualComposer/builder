var vcCake = require('vc-cake');
require('./node-services');
vcCake.start(function() {
	
  require('./node-modules');
  // Content
  /*loader.loadModule('content/storage');
  loader.loadModule('content/editor-controls');
  // Editor ui
  loader.loadModule('ui/navbar');
  loader.loadModule('ui/add-element');
  loader.loadModule('ui/edit-element');

  loader.loadModule('ui/tree-layout');*/
});
window.app = vcCake;
