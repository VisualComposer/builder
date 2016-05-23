import lodash from 'lodash'

module.exportss = (data, key, settings) => {
  var isMultiple = !!settings.multiple
  var value = data[ key ]
  var returnValue = value
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
