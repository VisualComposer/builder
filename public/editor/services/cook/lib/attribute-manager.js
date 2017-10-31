import { default as ElementAttribute } from './element-attribute'
import { env } from 'vc-cake'

export default {
  items: {},
  add (name, component, settings, representers = {}) {
    let { setter, getter, ...attributeSettings } = settings
    this.items[ name ] =
      new ElementAttribute(name, component, attributeSettings, representers)
    if (typeof setter === 'function') {
      this.items[ name ].setSetter(setter)
    }
    if (typeof getter === 'function') {
      this.items[ name ].setGetter(getter)
    }
    if (env('ATTRIBUTE_LIBS')) {
      // TODO: move varialbe declaration to the beginnig after TF remove
      let { getAttributeLibs } = settings
      if (typeof getAttributeLibs === 'function') {
        this.items[ name ].setGetAttributeLibs(getAttributeLibs)
      }
    }
  },
  get (name) {
    return this.items[ name ] || null
  }
}
