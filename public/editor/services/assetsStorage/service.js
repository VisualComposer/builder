import vcCake from 'vc-cake'
import AssetsStorage from './lib/assetsStorage'

const storage = new AssetsStorage()

class PublicApi {
  constructor (elements = {}) {
    storage.set(elements)
  }

  // ==== Elements
  /**
   * Set elements
   * @param elements
   */
  setElements (elements) {
    storage.set(elements)
    return this
  }

  /**
   * Add element by id
   * @param id
   */
  addElement (id) {
    storage.add(id)
    return this
  }

  /**
   * Reset elements list
   * @param ids
   * @returns {publicApi.resetElements}
   */
  resetElements (ids) {
    storage.reset(ids)
    return this
  }

  /**
   * Update element by id
   * @param id
   * @returns {publicApi}
   */
  updateElement (id) {
    storage.update(id)
    return this
  }

  /**
   * Remove element by id
   * @param id
   * @returns {publicApi}
   */
  removeElement (id) {
    storage.remove(id)
    return this
  }

  /**
   * get element by id
   * @param id
   * @returns {*}
   */
  getElementById (id) {
    return storage.get(id)
  }

  /**
   * Get all elements
   * @returns {*}
   */
  getElements () {
    return storage.get()
  }

  // ==== Other getters
  /**
   * Get elements tags list
   * @returns {*|Array}
   */
  getElementsTagsList () {
    return storage.getTagsList()
  }

  /**
   * Get css mixin data by element
   * @param element
   * @returns {*|{}}
   */
  getCssMixinsByElement (element) {
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

  // ==== Other css data
  /**
   * Set custom css styles
   * @param styles
   */
  setCustomCss (styles) {
    storage.setCustomCss(styles)
    return this
  }

  /**
   * Get custom css styles
   * @returns {*}
   */
  getCustomCss () {
    return storage.getCustomCss()
  }

  /**
   * Set global css styles
   * @param styles
   */
  setGlobalCss (styles) {
    storage.setGlobalCss(styles)
    return this
  }

  /**
   * Get global css styles
   * @returns {*}
   */
  getGlobalCss () {
    return storage.getGlobalCss()
  }

  // ==== Get css data
  getPageCssData () {
    let styles = []
    styles = styles.concat(
      storage.getCustomCssData(),
      storage.getAttributesMixinsCssData()
    )
    return styles
  }

  getSiteCssData (editor = false) {
    let styles = []
    styles = styles.concat(
      storage.getElementsCssData(editor),
      storage.getColumnsCssData(),
      storage.getMixinsCssData(),
      storage.getGlobalCssData()
    )
    return styles
  }

  getCssDataByElement (element, options = {}) {
    let styles = []
    styles = styles.concat(
      storage.getCssDataByElement(element, options)
    )
    return styles
  }

  // ==== Get css data for wordpress backend, doesn't include custom and global css
  getWpBackendPageCssData () {
    let styles = []
    styles = styles.concat(
      storage.getAttributesMixinsCssData()
    )
    return styles
  }

  getWpBackendSiteCssData (editor = false) {
    let styles = []
    styles = styles.concat(
      storage.getElementsCssData(editor),
      storage.getColumnsCssData(),
      storage.getMixinsCssData(),
    )
    return styles
  }

  getGoogleFontsData () {
    return storage.getGoogleFontsData()
  }
}
let singleton = false
const service = {
  create (elements = {}) {
    return new PublicApi(elements = {})
  },
  getGlobalInstance () {
    if (!singleton) {
      singleton = this.create()
    }
    return singleton
  }
}

vcCake.addService('assetsStorage', service)
