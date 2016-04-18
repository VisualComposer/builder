import {getService, addService} from 'vc-cake';
import {default as elementSettings} from './lib/element-settings';
import _ from 'lodash';

const documentManager = getService('document');
const attributesManager = getService('attributes');

class Element {
  constructor(id) {
    this.element = {};
    this.data = documentManager.get(id);
    if (!this.data || !this.data.tag) {
      throw new Error('Wrong element id: ' + id);
    }
  }
  /**
  * Build attributes to map setters and getter to element data.
  */
  buildAttributes() {
    var settings = elementSettings.get(this.data.tag);
    // var groups = {};
    Object.keys(settings).forEach(function(key) {
        let option = settings[key];
        let attributeSettings = attributesManager.get(key);
        let getter = function(element, key){
          return function() {
            attributeSettings.getValue(element, key);
          }
        };
        let setter = function(element, key, value) {
          return function(value) {
            attributeSettings.setter(this.element, key, value);
          }
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
        } else if ('group' === option.access) {
          var groupGetter =   function(key) {
            return function(key) {
                return {

                };
            };
          };
          Object.defineProperty(settings, key, {
            enumerable: false,
            configurable: false,
            writable: false,
            get: groupGetter
          }
        }
      });
  }

  build() {
    this.buildAttributes();
    return this.element;
  }

}

addService('element-manager', {
  get: function(id) {
    var element = new Element(id);
    return element.build();
  },
  addElement: function(settings) {
    elementSettings.add(settings);
  }
});
