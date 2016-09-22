import lodash from 'lodash'

module.exports = (data, key, settings) => {
  let isMultiple = !!settings.multiple
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
  return returnValue
}
