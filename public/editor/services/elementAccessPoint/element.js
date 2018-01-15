class Element {
  constructor (data, services, storages) {
    this.data = data
    this.services = services
    this.storages = storages
    const cooked = this.cook()
    const publicSettings = cooked.filter((key, value, settings) => {
      return settings.access === 'public'
    })
    publicSettings.forEach(key => {
      Object.defineProperty(this, key, {
        set: (value) => {
          storages.elements.trigger('update', data.id, {
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
    return this.services.document.get(this.data.id)
  }
}

export default Element
