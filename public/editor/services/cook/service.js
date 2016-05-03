import lodash from 'lodash';
import {addService} from 'vc-cake';
import {default as elementSettings} from './lib/element-settings';
import {default as attributeManager} from './lib/attribute-manager';
import {default as elementComponent} from './lib/element-component';
import {buildSettingsObject} from './lib/tools';
class Element {
  constructor(data) {
    this.data = data;
  }

  get(k) { // 'editform:general:fields'
    let {type, settings} = this.getAttributeType(k);
    return type ? type.getValue(settings, this.data, k) : undefined;
  }

  set(k, v) {
    let {type, settings} = this.getAttributeType(k);
    return type ? type.setValue(settings, this.data, k, v) : undefined;
  }

  getAttributeType(k) {
    let settings = elementSettings.getAttributeType(this.data.tag, k);
    if (!settings.type) {
      throw new Error('No type settings for element attribute ' + k + ' in ' + this.data.tag);
    }
    let type = attributeManager.get(settings.type);
    if (!type) {
      throw new Error('No attribute type settings for ' + k + ' in ' + this.data.tag);
    }
    return {type: type, settings: settings};
  }

  render() {
    if (!elementComponent.has(this.data.tag)) {
      throw new Error();
    }
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
    settings(orderBy = ['name'], order = ['asc']) {
      var list = elementSettings.list();
      return lodash.sortByOrder(list.map((item) => {
        return buildSettingsObject(item.settings);
      }), orderBy, order);
    }
  },
  elementComponent: {
    add(name, Component) {
      elementComponent.add(name, Component);
    },
    get(name) {
      return elementComponent.get(name);
    },
    has(name) {
      return elementComponent.has(name);
    }
  }
});
