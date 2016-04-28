import {getService, addService} from 'vc-cake';
import {default as elementSettings} from './lib/element-settings';
import {default as AttributeManager} from './lib/attribute-manager';
class Element {
  constructor(tag) {
    this.element = {};
    this.tag = tag;
    this.buildAttributes();
    return this.element;
  }
  /**
  * Build attributes to map setters and getter to element data.
  */
  buildAttributes() {
    var settings = elementSettings.get(this.tag);
    // var groups = {};
    Object.keys(settings).forEach(function(key) {
        let option = settings[key];
        let attributeSettings = attributesManager.get(key);
        let getter = function(element, key){
          return function() {
            attributeSettings.getValue(element, key);
          };
        };
        let setter = function(element, key) {
          return function(value) {
            attributeSettings.setter(this.element, key, value);
          };
        };
        if ('undefined' === typeof option.acesss || 'protected' === option.access) {
          Object.defineProperty(settings, key, {
            enumerable: false,
            configurable: false,
            writable: false,
            get: getter(this.element, key),
          });
        } else if ('public' === option.access) {
          Object.defineProperty(settings, key, {
            enumerable: true,
            configurable: false,
            writable: true,
            get: getter(this.element, key),
            set: setter(this.element, key)
          });
        }
      });
  }
}


addService('cook', {
  get(tag) {
    return new Element(tag);
  },
  add(settings, componentCallback, cssSettings, javascriptCallback) {
    elementSettings.add(settings, componentCallback, cssSettings, javascriptCallback);
  },
  attributes: {
    add(name, component, settings) {
      AttributeManager.add(name, component,
        _.defaults(('object' === typeof settings ? settings : {}), {setter: null, getter: null}));
    },
    remove(name) {
      delete AttributeManager.items[name];
    },
    get(name) {
      var attributeElement = AttributeManager.get(name);
      if (attributeElement) {
        return attributeElement;
      }
      throw new Error('Error! attribute type doesn\'t exist.');
    }
  }
});