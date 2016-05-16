export default class {
  constructor (name, component, settings) {
    this.name = name
    this.component = component
    this.settings = settings

    this.setter = null
    this.getter = null
  }

  setSetter (setter) {
    this.setter = setter
  }

  setGetter (getter) {
    this.getter = getter
  }

  getValue (settings, data, key) {
    if (typeof data[ key ] === 'undefined' && typeof settings.value !== 'undefined') {
      data[ key ] = settings.value
    }
    return this.getter ? this.getter(data, key, settings) : this.getRawValue(data, key)
  }

  setValue (settings, data, key, value) {
    if (settings.access !== 'public') {
      console && console.error('Attribute ' + key + ' not writable. It is protected.')
      return data
    }
    if (this.setter) {
      let data = this.setter(data, key, value, settings)
    } else {
      this.setRawValue(data, key, value)
    }
    return data
  }

  setRawValue (data, key, value) {
    data[ key ] = value
    return data
  }

  getRawValue (data, key) {
    return data[ key ]
  }

  getField () {
    return this.component
  }
}
