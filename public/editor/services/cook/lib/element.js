import {default as elementSettings} from './element-settings';
import {default as attributeManager} from './attribute-manager';

export default class Element {
  constructor(data) {
    this.data = data;
  }

  get(k) {
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
  toJS() {
    return this.data;
  }
}
