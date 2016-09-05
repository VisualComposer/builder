module.exports = (data, key) => {
  let value = Object.assign(data[ key ])
  console.log('getter is called')
  return value
}
