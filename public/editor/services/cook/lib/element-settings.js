import lodash from 'lodash';

let items = {};
export default {
  add(settings, componentCallback, cssSettings, javascriptCallback) {
    items[settings.tag.value] = {
      settings: lodash.defaults(settings, {tag: null}),
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
  getAttributeType(tag, key) {
    let settings = items[tag].settings[key];
    return settings || undefined;
  },
  all() {
    return items;
  },
  list() {
    return Object.keys(items).map((k) => {
      return items[k];
    });
  }
};
