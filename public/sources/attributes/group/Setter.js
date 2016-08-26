import {default as ElementGroup} from './lib/element-group'

module.exports = (data, key, value) => {
  let group = new ElementGroup(key, value)
  data[ key ] = group.update(value)
  return data
}
