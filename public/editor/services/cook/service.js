import lodash from 'lodash';
import {addService} from 'vc-cake';
import {default as elementSettings} from './lib/element-settings';
import {default as attributeManager} from './lib/attribute-manager';

class Element {
  constructor(data) {
    this.data = data;
    /*    Object.defineProperty(this, 'settings', {
     enumerable: false,
     get: function() {
     if (!this.elementSettings) {
     this.elementSettings = elementSettings.get(this.data.tag);
     }
     return this.elementSettings;
     }
     });*/
  }

  get(k) {
    let attributeType = this.getAttributeType(k);
    return attributeType ? attributeType.getValue(this.data, k) : undefined;
  }

  set(k, v) {
    let attributeSettings = this.getAttributeType(k);
    return attributeSettings ? attributeSettings.setValue(this.data, k, v) : undefined;
  }

  getAttributeType(k) {
    let attributeSettings = elementSettings.getAttributeType(this.data.tag, k);
    if (!attributeSettings.type) {
      throw new Error('No type settings for element attribute ' + k + ' in ' + this.data.tag);
    }
    let attributeType = attributeManager.get(attributeSettings.type);
    if (!attributeType) {
      throw new Error('No attribute type settings for ' + k + ' in ' + this.data.tag);
    }
    return attributeType;
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
  },
  list: {
    all: elementSettings.items
  }
});