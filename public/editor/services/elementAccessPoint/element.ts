const privateCookElementKey = Symbol(' _cookElement')
const privateDataElementKey = Symbol(' _data')

interface Services {
  cook: {
    // disabling lint, because data can be any element object with different properties
    get: (data:any) => {} // eslint-disable-line
  }
}

type ElementStorageCallback = () => void

interface Storages {
  elements: {
    // disabling lint, because element can be any element object with different properties
    trigger: (action:string, id:string, element:any, source:string, options:{changedAttribute:string, changedAttributeType:string}) => void, // eslint-disable-line
    on: (id:string, fn:ElementStorageCallback) => void,
    off: (id:string, fn:ElementStorageCallback) => void,
  }
}

export default class Element {
  inner: boolean
  innerMultipleLevel:boolean
  id:string
  tag:string
  services:Services
  storages:Storages

  constructor (data: {inner:boolean, innerMultipleLevel:boolean, id:string, tag:string}, services:Services, storages:Storages) {
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
        // @ts-ignore accessing object property via bracket notation
        return this.services.cook.get(this[privateDataElementKey])
      }
    })

    if (typeof this.id === 'undefined') {
      this.id = this.cook().get('id')
    }
  }

  set (key:string, value:string) {
    const cookElement = this.cook()
    cookElement.set(key, value)
    // @ts-ignore accessing object property via bracket notation
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
    // @ts-ignore accessing object property via bracket notation
    return this[privateCookElementKey]()
  }

  onChange (callback:ElementStorageCallback) {
    this.storages.elements.on(`element:${this.id}`, callback)
  }

  onAttributeChange () {
    // return // temporary disable
    // this.storages.elements.on(`element:${this.id}:attribute:${fieldKey}`, callback)
  }

  ignoreChange (callback:ElementStorageCallback) {
    this.storages.elements.off(`element:${this.id}`, callback)
  }

  ignoreAttributeChange () {
    // return // temporary disable
    // this.storages.elements.off(`element:${this.id}:attribute:${fieldKey}`, callback)
  }
}
