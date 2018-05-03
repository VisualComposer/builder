import { env } from 'vc-cake'

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
            [ key ]: val
          }, 'editForm', {
            changedAttribute: key,
            changedAttributeType: settings.type
          })
        } : () => {
          console.warn('protected key')
        },
        get: () => {
          let value = this.get()[ key ]
          if (!value) {
            let cookKey = this.cook().get(key)
            if (cookKey) {
              value = cookKey.value
            }
          }
          return value
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
    if (env('TF_RENDER_PERFORMANCE')) {
      this.storages.elements.on(`element:${this.id}`, callback)
    } else {
      this.storages.elements.state(`element:${this.id}`).onChange(callback)
    }
  }

  onAttributeChange (fieldKey, callback) {
    // return // temporary disable
    // if (env('TF_RENDER_PERFORMANCE')) {
    //   this.storages.elements.on(`element:${this.id}:attribute:${fieldKey}`, callback)
    // } else {
    //   this.storages.elements.state(`element:${this.id}:attribute:${fieldKey}`).onChange(callback)
    // }
  }

  ignoreChange (callback) {
    if (env('TF_RENDER_PERFORMANCE')) {
      this.storages.elements.off(`element:${this.id}`, callback)
    } else {
      this.storages.elements.state(`element:${this.id}`).ignoreChange(callback)
    }
  }

  ignoreAttributeChange (fieldKey, callback) {
    // return // temporary disable
    // if (env('TF_RENDER_PERFORMANCE')) {
    //   this.storages.elements.off(`element:${this.id}:attribute:${fieldKey}`, callback)
    // } else {
    //   this.storages.elements.state(`element:${this.id}:attribute:${fieldKey}`).ignoreChange(callback)
    // }
  }
}

export default Element
