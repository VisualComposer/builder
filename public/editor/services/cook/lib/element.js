
require("babel-polyfill");

import {default as elementSettings} from './element-settings';
import {default as attributeManager} from './attribute-manager';

export default class Element {
  constructor(data) {
    Element.data = data;
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
    if (!elementComponent.has(ElementObject.data.tag)) {
      throw new Error();
    }
  }
  static create(tag) {
    return new Element({tag: tag});
  }
  toJS() {
    let data = {};
    for(let k of Object.keys(Element.settings)) {
      data[k] = this.get(k);
    }
    return data;
  }
  *[Symbol.iterator]() {
    for(let k of Object.keys(Element.settings)) {
      yield [k, this.get(k)];
    }
  }
}
