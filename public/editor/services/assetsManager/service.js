import vcCake from 'vc-cake'
import assetsManager from './lib/assetsManager'

let publicApi = {
   /**
   * Get js files list by tags
   * @returns {*}
   */
  getJsFilesByTags (tags) {
    return assetsManager.getJsFilesByTags(tags)
  },

  /**
   * Get css files list
   * @returns {*}
   */
  getCssFilesByTags (tags) {
    return assetsManager.getCssFilesByTags(tags)
  },

  /**
   * get Assets library JS files list
   * @param lib
   * @returns {Array}
   */
  getAssetsLibraryJsFiles (lib) {
    return assetsManager.getAssetsLibraryJsFiles(lib)
  },

  /**
   * Get assets library CSS files list
   * @param lib
   * @returns {Array}
   */
  getAssetsLibraryCssFiles (lib) {
    return assetsManager.getAssetsLibraryCssFiles(lib)
  }
}

vcCake.addService('assetsManager', publicApi)
