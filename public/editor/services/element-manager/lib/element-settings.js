import {_} from 'lodash';

const items = {};
export default {
  add(settings, componentCallback, cssSettings, javascriptCallback) {
    items[settings.tag.value] = {
      settings: _.defaults(settings, {tag: null, getter: null}),
      component: componentCallback,
      cssSettings: cssSettings,
      javascript: javascriptCallback
    }
  },
  remove(tag) {
    delete items[tag];
  },
  get(tag) {
    var attributeElement = item[tag];
    if (attributeElement) {
      return attributeElement;
    }
    throw new Error('Error! element settings list doesn\'t exist.');
  }
};