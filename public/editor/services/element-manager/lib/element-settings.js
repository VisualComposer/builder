import {_} from 'lodash';

const items = {};
export default {
  add(settings) {
    items[settings.tag.value] = _.defaults(settings, {tag: null, getter: null});
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