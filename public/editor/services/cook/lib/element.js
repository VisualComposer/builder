import {default as elementSettings} from './element-settings';
import {default as attributeManager} from './attribute-manager';

export default class Element {
  constructor(data) {
    Element.data = data;
  }

  get(k) {
    let {type, settings} = this.getAttributeType(k);
    return type ? type.getValue(settings, Element.data, k) : undefined;
  }

  set(k, v) {
    let {type, settings} = this.getAttributeType(k);
    if (type) {
      Element.data = type.setValue(settings, Element.data, k, v);
    }
    return Element.data[k];
  }

  getAttributeType(k) {
    let settings = elementSettings.getAttributeType(Element.data.tag, k);
    if (!settings || !settings.type) {
      throw new Error('No type settings for element attribute ' + k + ' in ' + Element.data.tag);
    }
    let type = attributeManager.get(settings.type);
    if (!type) {
      throw new Error('No attribute type settings for ' + k + ' in ' + Element.data.tag);
    }
    return {type: type, settings: settings};
  }

  render() {
    if (!elementComponent.has(ElementObject.data.tag)) {
      throw new Error();
    }
  }

  toJS(selector) {
    return Element.data;
  }

}
