import {default as ElementGroup} from './lib/element-group'

module.exports = (data, key) => {
  let value = data[ key ]
  return new ElementGroup(key, value)
}
