import ElementAttribute from './element-attribute'

export default {
  items: {},
  add (name, component, settings, representers = {}) {
    const { setter, getter, getAttributeLibs, ...attributeSettings } = settings
    this.items[name] =
      new ElementAttribute(name, component, attributeSettings, representers)
    if (typeof setter === 'function') {
      this.items[name].setSetter(setter)
    }
    if (typeof getter === 'function') {
      this.items[name].setGetter(getter)
    }
    if (typeof getAttributeLibs === 'function') {
      this.items[name].setGetAttributeLibs(getAttributeLibs)
    }
  },
  get (name) {
    return this.items[name] || null
  }
}
