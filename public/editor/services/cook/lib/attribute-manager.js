import {default as ElementAttribute} from './element-attribute';

export default {
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
