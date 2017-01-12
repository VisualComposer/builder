import vcCake from 'vc-cake'
import assetsStorage from './lib/assetsStorage'

let publicApi = {
  // ==== Elements
  /**
   * Set elements
   * @param elements
   */
  setElements (elements) {
    assetsStorage.set(elements)
    return this
  },
  /**
   * Add element by id
   * @param id
   */
  addElement (id) {
    assetsStorage.add(id)
    return this
  },
  /**
   * Reset elements list
   * @param ids
   * @returns {publicApi.resetElements}
   */
  resetElements (ids) {
    assetsStorage.reset(ids)
    return this
  },
  /**
   * Update element by id
   * @param id
   * @returns {publicApi}
   */
  updateElement (id) {
    assetsStorage.update(id)
    return this
  },
  /**
   * Remove element by id
   * @param id
   * @returns {publicApi}
   */
  removeElement (id) {
    assetsStorage.remove(id)
    return this
  },
  /**
   * get element by id
   * @param id
   * @returns {*}
   */
  getElementById (id) {
    return assetsStorage.get(id)
  },
  /**
   * Get all elements
   * @returns {*}
   */
  getElements () {
    return assetsStorage.get()
  },

  // ==== Other getters
  /**
   * Get elements tags list
   * @returns {*|Array}
   */
  getElementsTagsList () {
    return assetsStorage.getTagsList()
  },
  /**
   * Get css mixin data by element
   * @param element
   * @returns {*|{}}
   */
  getCssMixinsByElement (element) {
    return assetsStorage.getCssMixinsByElement(element)
  },
  /**
   * Get attributes mixin data by element
   * @param element
   * @returns {*|{}}
   */
  getAttributesMixinsByElement (element) {
    return assetsStorage.getAttributesMixinsByElement(element)
  },

  // ==== Other css data
  /**
   * Set custom css styles
   * @param styles
   */
  setCustomCss (styles) {
    assetsStorage.setCustomCss(styles)
    return this
  },
  /**
   * Get custom css styles
   * @returns {*}
   */
  getCustomCss () {
    return assetsStorage.getCustomCss()
  },
  /**
   * Set global css styles
   * @param styles
   */
  setGlobalCss (styles) {
    assetsStorage.setGlobalCss(styles)
    return this
  },
  /**
   * Get global css styles
   * @returns {*}
   */
  getGlobalCss () {
    return assetsStorage.getGlobalCss()
  },

  // ==== Get css data
  getPageCssData () {
    let styles = []
    styles = styles.concat(
      assetsStorage.getDesignOptionsCssData(),
      assetsStorage.getCustomCssData(),
      assetsStorage.getAttributesMixinsCssData()
    )
    return styles
  },
  getSiteCssData (editor = false) {
    let styles = []
    styles = styles.concat(
      assetsStorage.getElementsCssData(editor),
      assetsStorage.getColumnsCssData(),
      assetsStorage.getMixinsCssData(),
      assetsStorage.getGlobalCssData()
    )
    return styles
  },
  getGoogleFontsData () {
    return assetsStorage.getGoogleFontsData()
  }
}

vcCake.addService('wipAssetsStorage', publicApi)
