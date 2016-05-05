require('babel-polyfill');
import {createElement} from 'react';

import {default as elementSettings} from './element-settings';
import {default as attributeManager} from './attribute-manager';
import {default as elementComponent} from './element-component';
import {createKey, buildSettingsObject} from './tools';

export default class Element {
  constructor(data) {
    let {id = createKey(), parent = false, ...attr} = data;
    Element.id = id;
    Element.parent = parent;
    Element.data = attr;
    Element.settings = elementSettings.get(Element.data.tag).settings;
    Element.getAttributeType = function(k) {
      let data = {type: false, settings: false};
      let attrSettings = this.settings[k];
      if (attrSettings && attrSettings.type) {
        data.settings = attrSettings;
        data.type = attributeManager.get(attrSettings.type) || false;
      }
      return data;
    };
    Element.component = {
      add(Component) {
        elementComponent.add(Element.data.tag, Component);
      },
      get() {
        return elementComponent.get(Element.data.tag);
      },
      has() {
        return elementComponent.has(Element.data.tag);
      }
    };
    Element.scope = 'value';
  }

  get(k) {
    let {type, settings} = Element.getAttributeType(k);
    return type && settings ? type.getValue(settings, Element.data, k) : undefined;
  }

  set(k, v) {
    let {type, settings} = Element.getAttributeType(k);
    if (type && settings) {
      Element.data = type.setValue(settings, Element.data, k, v);
    }
    return Element.data[k];
  }

  render() {
    if (!Element.component.has()) {
      elementSettings.get(Element.data.tag).component(Element.component);
    }
    let Component = Element.component.get();
    let props = this.toJS();
    props.key = Element.id;
    props.id = Element.id;
    props['data-vc-element'] = Element.id;
    return createElement(Component, props);
  }
  static create(tag) {
    return new Element({tag: tag});
  }
  toJS() {
    let data = {};
    for (let k of Object.keys(Element.settings)) {
      data[k] = this.get(k);
    }
    return data;
  }
  *[Symbol.iterator]() {
    for (let k of Object.keys(Element.settings)) {
      yield [k, this.get(k)];
    }
  }
  field(k) {
    let {type, settings} = Element.getAttributeType(k);
    return createElement(type.component, {fieldKey: k, settings: settings, value: type.getRawValue(Element.data, k)});
  }
  publicKeys() {
    let data = [];
    for (let k of Object.keys(Element.settings)) {
      var attrSettings = Element.settings[k];
      if ('public' === attrSettings.access) {
        data.push(k);
      }
    }
    return data;
  }
}
