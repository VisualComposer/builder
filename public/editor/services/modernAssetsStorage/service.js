import { addService, env } from 'vc-cake'
import AssetsStorage from './lib/assetsStorage'

const storage = new AssetsStorage()

class PublicApi {
  /**
   * Get element tags by data
   * @param data
   * @returns {Array}
   */
  getElementTagsByData (data) {
    return Object.keys(storage.getElementTagsByTagName(data.tag, {}, data))
  }

  /**
   * Get css mixin data by element
   * @param element
   * @returns {*|{}}
   */
  getCssMixinsByElement (element) {
    if (!element.tag) {
      env('VCV_DEBUG') && console.warn('Assets.service no element tag provided', element)

      return {}
    }

    return storage.getCssMixinsByElement(element)
  }

  /**
   * Get attributes mixin data by element
   * @param element
   * @returns {*|{}}
   */
  getAttributesMixinsByElement (element) {
    return storage.getAttributesMixinsByElement(element)
  }

  getCssDataByElement (element, options = {}) {
    return storage.getCssDataByElement(element, options)
  }

  elementCssBase (tag) {
    return storage.elementCssBase(tag)
  }

  getElementGlobalAttributesCssMixins (elementData) {
    return storage.getElementGlobalAttributesCssMixins(elementData)
  }

  getPageDesignOptionsMixins (elementData) {
    return storage.getPageDesignOptionsMixins(elementData)
  }

  getElementLocalAttributesCssMixins (elementData) {
    return storage.getElementLocalAttributesCssMixins(elementData)
  }

  elementCssEditor (tag) {
    return storage.elementCssEditor(tag)
  }
}

const singleton = new PublicApi()
const service = {
  create () {
    return singleton
  }
}
addService('modernAssetsStorage', service)
