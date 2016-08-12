import {default as ElementGroup} from './lib/element-group'

module.exports = (data, key) => {
  let value = Object.assign(data[ key ])
  return new ElementGroup(key, value)
}
