import lodash from 'lodash'

export default (data, key, settings) => {
  const isMultiple = settings.options && settings.options.multiple
  const value = data[key]
  let returnValue = value
  if (lodash.isString(value) && isMultiple) {
    returnValue = [value]
  } else if (lodash.isArray(value) && !isMultiple) {
    returnValue = value[0]
  } else if (lodash.isObject(value) && !lodash.isArray(value)) {
    // Note: isObject(['test']) returns true!
    if (!value.ids && !value.urls && value.id) {
      returnValue = value
    } else {
      if (isMultiple) {
        returnValue = value.urls
      } else if (lodash.isArray(value.urls)) {
        returnValue = value.urls[0]
      } else {
        returnValue = value
      }
    }
  }

  return returnValue
}
