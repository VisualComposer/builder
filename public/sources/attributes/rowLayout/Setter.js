export default (data, key, value) => {
  if (data && data[key]) {
    data[key] = value
  }
  return data
}
