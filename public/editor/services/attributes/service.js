import vcCake from 'vc-cake';
import _ from 'lodash';
var ElementAttribute = require('./lib/element-attribute');
var Manager = {
  items: {},
  add(name, component, settings) {
    var {setter, getter, ...attributeSettings} = settings;
    this.items[name] = 
      new ElementAttribute(name, component, attributeSettings);
    if ('function' === typeof setter) {
      this.items[name].setSetter(setter);
    }
    if ('function' === typeof getter) {
      this.items[name].setGetter(getter);
    }
  },
  get(name) {
    return this.items[name] || null;
  }
};
vcCake.addService('attributes', {
  add(name, component, settings) {
    Manager.add(name, component,
      _.defaults(('object' === typeof settings ? settings : {}), {setter: null, getter: null}));
  },
  remove(name) {
    delete Manager.items[name];
  },
  get(name) {
    var attributeElement = Manager.get(name);
    if (attributeElement) {
      return attributeElement;
    }
    throw new Error('Error! attribute type doesn\'t exist.');
  }
});