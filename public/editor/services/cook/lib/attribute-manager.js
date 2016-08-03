import {default as ElementAttribute} from './element-attribute'

export default {
  items: {},
  add (name, component, settings) {
    let { setter, getter, ...attributeSettings } = settings
    this.items[ name ] =
      new ElementAttribute(name, component, attributeSettings)
    if (typeof setter === 'function') {
      this.items[ name ].setSetter(setter)
    }
    if (typeof getter === 'function') {
      this.items[ name ].setGetter(getter)
    }
  },
  get (name) {
    return this.items[ name ] || null
  }
}
