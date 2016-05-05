import {default as lodash} from 'lodash';
import {addService} from 'vc-cake';

import {default as elementComponent} from './lib/element-component';
import {buildSettingsObject} from './lib/tools';
import {default as elementSettings} from './lib/element-settings';
import {default as attributeManager} from './lib/attribute-manager';
import {default as Element} from './lib/element';

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
      return null;
    }
  },
  list: {
    settings(sortSelector = ['name']) {
      var list = elementSettings.list();
      return lodash.sortBy(list.map((item) => {
        return buildSettingsObject(item.settings);
      }), sortSelector);
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
