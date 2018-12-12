import ElementGroup from './lib/element-group'

export default (data, key) => {
  let value = Object.assign(data[ key ])
  return new ElementGroup(key, value)
}
