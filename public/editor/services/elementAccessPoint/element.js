class Element {
  constructor (data, services, storages) {
    this.id = data.id
    this.services = services
    this.storages = storages
    const cooked = this.cook()
    cooked.filter((key, value, settings) => {
      Object.defineProperty(this, key, {
        set: settings.access === 'public' ? (val) => {
          storages.elements.trigger('update', this.id, {
            ...this.get(),
            [key]: val
          })
        } : () => {
          console.warn('protected key')
        },
        get: () => {
          return this.get()[ key ]
        }
      })
      return false
    })
    Object.defineProperty(this, 'customHeaderTitle', {
      set: (val) => {
        storages.elements.trigger('update', this.id, {
          ...this.get(),
          customHeaderTitle: val
        })
      },
      get: () => {
        return this.get().customHeaderTitle
      }
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

  ignoreChange (callback) {
    this.storages.elements.state(`element:${this.id}`).ignoreChange(callback)
  }

  ignoreAttributeChange (fieldKey, callback) {
    this.storages.elements.state(`element:${this.id}:attribute:${fieldKey}`).ignoreChange(callback)
  }
}

export default Element
