export default (data, key, settings) => {
  const value = data[key]
  const fieldValue = settings.value
  const isCSSMixin = settings.options && settings.options.cssMixin
  const isValueObject = value && typeof value === 'object' && value.constructor === Object
  let valueContainsChars
  let returnValue = { ...value }
  if (isCSSMixin) {
    if (!isValueObject) {
      returnValue = {}
      returnValue.input = value
      returnValue.select = fieldValue.select
      valueContainsChars = value.slice(parseFloat(value).toString().length)
      if (!valueContainsChars) {
        returnValue.mixinValue = value + fieldValue.select
      }
    } else {
      returnValue.mixinValue = value.input + value.select
    }
  }

  return returnValue
}
