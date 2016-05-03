import lodash from 'lodash';

const items = {};
export default {
  add(settings, componentCallback, cssSettings, javascriptCallback) {
    items[settings.tag.value] = {
      settings: lodash.defaults(settings, {tag: null, getter: null}),
      component: componentCallback,
      cssSettings: cssSettings,
      javascript: javascriptCallback
    };
  },
  remove(tag) {
    delete items[tag];
  },
  get(tag) {
    return items[tag] || null;
  },
  getAttributeType: function(tag, key) {
    let settings = items[tag].settings[key];
    return settings || undefined;
  }
};
