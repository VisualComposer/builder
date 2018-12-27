export function getJsonFromString (string) {
  let regex = /(\{"\w+".*\})/g
  var result = string.match(regex)
  if (result) {
    return result[0]
  }

  return false
}

export function getResponse (result) {
  let response = null
  try {
    response = JSON.parse(result)
  } catch (e) {
    console.warn('Failed to parse, no valid json.', e, result)
    let jsonString = getJsonFromString(result)
    response = JSON.parse(jsonString)
  }

  return response
}
