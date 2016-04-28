import {elementSettings}  from './element-settings';
import {accessors} from './accessors';

const attributeManager = vcCake.get('attributes');

export function buildAttributes(element) {
  let data = {};
  return data;
}
export function buildGroup(tag, groupKey, element) {
  let data = {};
  let settings = elementSettings.get(tag);
  if (settings[groupKey] && 'group' === settings[groupKey].access) {
    let access = settings[groupKey].access;
    data = accessors[access](groupKey, settings, element);
  }
  return data;
};