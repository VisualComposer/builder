const privateCookElementKey = Symbol(' _cookElement')
const privateDataElementKey = Symbol(' _data')

export default class Element {
  constructor (data, services, storages) {
    this.inner = data.inner
    this.innerMultipleLevel = data.innerMultipleLevel
    this.id = data.id
    this.tag = data.tag
    this.services = services
    this.storages = storages

    Object.defineProperty(this, privateDataElementKey, {
      writable: false,
      value: data
    })
    Object.defineProperty(this, privateCookElementKey, {
      writable: false,
      value: () => {
        return this.services.cook.get(this[privateDataElementKey])
      }
    })

    if (typeof this.id === 'undefined') {
      this.id = this.cook().get('id')
    }
  }

  set (key, value) {
    const cookElement = this.cook()
    cookElement.set(key, value)
    this[privateDataElementKey][key] = value
    if (!this.inner) {
      this.storages.elements.trigger('update', this.id, {
        ...this.cook().toJS(),
        [key]: value
      }, 'editForm', {
        changedAttribute: key,
        changedAttributeType: cookElement.settings(key).type
      })
    }
  }

  cook () {
    return this[privateCookElementKey]()
  }

  onChange (callback) {
    this.storages.elements.on(`element:${this.id}`, callback)
  }

  onAttributeChange () {
    // return // temporary disable
    // this.storages.elements.on(`element:${this.id}:attribute:${fieldKey}`, callback)
  }

  ignoreChange (callback) {
    this.storages.elements.off(`element:${this.id}`, callback)
  }

  ignoreAttributeChange () {
    // return // temporary disable
    // this.storages.elements.off(`element:${this.id}:attribute:${fieldKey}`, callback)
  }
}
