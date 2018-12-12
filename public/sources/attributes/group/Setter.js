import ElementGroup from './lib/element-group'

export default (data, key, value) => {
  let group = new ElementGroup(key, value)
  data[ key ] = group.update(value)
  return data
}
