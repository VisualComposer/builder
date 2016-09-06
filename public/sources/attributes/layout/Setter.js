module.exports = (data, key, value) => {
  console.log('setter is called')
  if (data && data[key]) {
    data[key] = value
  }
  return data
}
