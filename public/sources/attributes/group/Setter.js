import {default as ElementGroup} from './lib/element-group'

module.exports = (data, key, value, settings) => {
  let group = new ElementGroup(key, value)
  data[ key ] = group.update(value)
  return data
}
