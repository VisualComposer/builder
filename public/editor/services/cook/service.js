import {lodash} from 'vc-cake';
import {addService} from 'vc-cake';
import {default as elementSettings} from './lib/element-settings';
import {default as attributeManager} from './lib/attribute-manager';

class Element {
  constructor(data) {
    this.data = data;
    Object.defineProperty(this, 'settings', {
      enumerable: false,
      configurable: false,
      writable: false,
      get: function() {
        if(!this.settings) {
          this.settings = attributeManager.get(this.data.tag);
        }
        return this.settings;
      }.bind(this)
    });
  }
  get(k){
    let attributeSettings = attributeManager.get(k);
    return attributeSettings.getValue(this.data, k);
  }
  set(k, v){
    let attributeSettings = attributeManager.get(k);
    return attributeSettings.setValue(this.data, k, v);
  }
}

addService('cook', {
  get(data) {
    if ('object' !== typeof data || !data.tag) {
      throw new Error('Cook: wrong data to get element!');
    }
    return data.tag ? new Element(data) : undefined;
  },
  add(settings, componentCallback, cssSettings, javascriptCallback) {
    elementSettings.add(settings, componentCallback, cssSettings, javascriptCallback);
  },
  attributes: {
    add(name, component, settings) {
      attributeManager.add(name, component,
        lodash.defaults(('object' === typeof settings ? settings : {}), {setter: null, getter: null}));
    },
    remove(name) {
      delete attributeManager.items[name];
    },
    get(name) {
      var attributeElement = attributeManager.get(name);
      if (attributeElement) {
        return attributeElement;
      }
      throw new Error('Error! attribute type doesn\'t exist.');
    }
  }
});