/**
 * Class for building attribute group
 */
export default class {
  constructor (tag, value) {
    this.tag = tag
    this.value = value
  }

  has (value) {
    if (Array.isArray(value)) {
      let result = false
      value.find((v) => {
        result = this.has(v)
        return result
      })
      return result
    }
    return this.value.indexOf(value) > -1
  }

  each (iterator = null) {
    if (typeof iterator === 'function') {
      return this.value.slice().map(iterator)
    }
    return this.value.slice()
  }

  update (value) {
    if (Array.isArray(value)) {
      this.value = value
      return this.value
    }
    return null
  }
}
