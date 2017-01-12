import lodash from 'lodash'
module.exports = (data, key, settings) => {
  let isMultiple = settings.options && settings.options.multiple
  let value = data[ key ]
  let returnValue = value
  if (lodash.isString(value) && isMultiple) {
    returnValue = [ value ]
  } else if (lodash.isArray(value) && !isMultiple) {
    returnValue = value[ 0 ]
  } else if (lodash.isObject(value)) {
    if (isMultiple) {
      returnValue = value.urls
    } else {
      returnValue = value.urls[ 0 ]
    }
  }
  if (lodash.isEmpty(returnValue) && settings.options && settings.options.defaultValue) {
    returnValue = settings.options.defaultValue
  }
  return returnValue
}
