var vcCake = require('vc-cake');
var attributes = require('./lib/attributes.js');
var components = require('./lib/components.js');
var defaults = require('./lib/defaults.js');
vcCake.addService('elements', {
  attributes: attributes,
  components: components,
  defaults: defaults,
});