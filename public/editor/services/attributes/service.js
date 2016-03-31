var vcCake = require('vc-cake');
var defaults = require('lodash').defaults;
var ElementAttribute = require('./element-attribute');
var Manager = {
  items: {},
  get: function(name, settings) {
    var AttributeComponent = this.items[name].view;
    return AttributeComponent(

    );
  }
};
vcCake.addService('attributes', {
  add: function(name, Component, settings) {
    Manager.items[name] = {
      view: Component,
      settings: defaults(settings, {setter: null, getter: null})
    }
  },
  remove: function(name) {
    delete Manager.items[name];
  },
  elementAttribute: function(name, settings, element) {
    return Manager.get(name, settings);
  }
});