var vcCake = require('vc-cake');

var attributes = require('./lib/attributes');
var components = require('./lib/components');
var defaults = require('./lib/defaults');

vcCake.addService('element', {
  attributes: attributes,
  components: components,
  defaults: defaults,
});
