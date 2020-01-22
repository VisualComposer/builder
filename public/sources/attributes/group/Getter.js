import ElementGroup from './lib/element-group'

export default (data, key) => {
  const value = Object.assign(data[key])
  return new ElementGroup(key, value)
}
