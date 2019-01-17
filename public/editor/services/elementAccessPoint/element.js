const privateCookElementKey = Symbol(' _cookElement')

export default class Element {
  constructor (data, services, storages) {
    this.inner = data.inner
    this.id = data.id
    this.tag = data.tag
    this.services = services
    this.storages = storages

    Object.defineProperty(this, privateCookElementKey, {
      writable: false,
      value: this.services.cook.get(data)
    })
  }

  set (key, value) {
    this[ privateCookElementKey ].set(key, value)
    if (!this.inner) {
      this.storages.elements.trigger('update', this.id, {
        ...this.cook().toJS(),
        [ key ]: value
      }, 'editForm', {
        changedAttribute: key,
        changedAttributeType: this[ privateCookElementKey ].settings(key).type
      })
    }
  }

  cook () {
    return this[ privateCookElementKey ]
  }

  onChange (callback) {
    this.storages.elements.on(`element:${this.id}`, callback)
  }

  onAttributeChange (fieldKey, callback) {
    // return // temporary disable
    // this.storages.elements.on(`element:${this.id}:attribute:${fieldKey}`, callback)
  }

  ignoreChange (callback) {
    this.storages.elements.off(`element:${this.id}`, callback)
  }

  ignoreAttributeChange (fieldKey, callback) {
    // return // temporary disable
    // this.storages.elements.off(`element:${this.id}:attribute:${fieldKey}`, callback)
  }
}
