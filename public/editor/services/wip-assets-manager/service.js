import vcCake from 'vc-cake'

if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
  vcCake.addService('assets-manager', {

    /**
     * Get element's public path
     * @param tag
     * @param file
     * @returns {*}
     */
    getPublicPath (tag, file) { // @AM
      let path = this.getSourcePath() + '/elements/' + tag + '/public'
      let $element = document.querySelector('[data-vc-element-script="' + tag + '"]')
      if ($element) {
        path = $element.dataset.vcElementUrl + '/public'
      }
      if (file) {
        path += '/' + file
      }

      return path
    },

    /**
     * Get source path
     * @param file
     * @returns {*}
     */
    getSourcePath (file = null) { // @AM
      let path
      if (vcCake.env('platform') === 'node') {
        path = window.vcvPluginUrl + 'sources'
      } else {
        path = window.vcvPluginUrl + 'public/sources'
      }
      if (file) {
        path += '/' + file
      }

      return path
    }
  })
}
