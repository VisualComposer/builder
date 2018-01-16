class Element {
  constructor (data, services, storages) {
    this.id = data.id
    this.services = services
    this.storages = storages
    const cooked = this.cook()
    const publicSettings = cooked.filter((key, value, settings) => {
      return settings.access === 'public'
    })
    publicSettings.forEach(key => {
      Object.defineProperty(this, key, {
        set: (value) => {
          storages.elements.trigger('update', this.id, {
            ...this.get(),
            [key]: value
          })
        },
        get: () => {
          return this.get()[ key ]
        }
      })
    })
  }

  cook () {
    return this.services.cook.get(this.get())
  }

  get () {
    return this.services.document.get(this.id)
  }

  onChange (callback) {
    this.storages.elements.state(`element:${this.id}`).onChange(callback)
  }

  onAttributeChange (fieldKey, callback) {
    this.storages.elements.state(`element:${this.id}:attribute:${fieldKey}`).onChange(callback)
  }
}

export default Element
