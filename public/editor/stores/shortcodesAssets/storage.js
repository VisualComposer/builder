import { addStorage, getService, getStorage } from 'vc-cake'

addStorage('shortcodeAssets', (storage) => {
  const utils = getService('utils')
  let loadedAssetsList = []

  /**
   * Get unique Slug for provided DomNode
   * @param {Element} domNode
   * @returns {string}
   */
  const getNodeSlug = (domNode) => {
    let slug = ''
    if (domNode.href) {
      slug = utils.slugify(domNode.href)
    } else if (domNode.src) {
      slug = utils.slugify(domNode.src)
    } else if (domNode.id && domNode.type && domNode.type.indexOf('template') >= 0) {
      slug = domNode.id
    } else {
      slug = utils.slugify(domNode.innerHTML || domNode.textContent)
    }

    return slug
  }

  /**
   * Checking is provided slug already loaded in page
   * @param {string} slug
   * @returns {boolean}
   */
  const isNodeCached = (slug) => {
    let cached = slug && slug.length > 0 && loadedAssetsList.indexOf(slug) >= 0
    // Remove first part of url, because they can differ by CDN and local files
    // Additional check for is cached by strip wp-content part
    if (!cached) {
      const cutSlug = slug.split('wp-content')[1]
      loadedAssetsList.forEach((loadedFile) => {
        const cutLoadedFile = loadedFile.split('wp-content')[1]
        if (cutLoadedFile && cutSlug && (cutLoadedFile === cutSlug)) {
          cached = true
        }
      })
    }

    return cached
  }

  /**
   * This method used to generate list of already loaded scripts/styles
   * in a page to avoid unnecessary overriding or duplicating
   */
  const cachePageAssets = () => {
    loadedAssetsList = []
    const assetsWindow = window.document.querySelector('.vcv-layout-iframe').contentWindow

    assetsWindow.document.querySelectorAll('style, link[href], script').forEach((domNode) => {
      loadedAssetsList.push(getNodeSlug(domNode))
    })
  }

  /**
   * Custom Scripts loaded
   * Used to async load provided scripts by src
   * Or append it immediately
   */
  const scriptsLoader = {
    shadowScriptsNodes: [],
    add: (item) => {
      scriptsLoader.shadowScriptsNodes.push(item)
    },
    /**
     * Recursive script queue loading
     * @param assetsWindow
     * @param ref
     * @param finishCb
     */
    loadNext: (assetsWindow, ref, finishCb) => {
      if (scriptsLoader.shadowScriptsNodes.length) {
        try {
          /** @var {Element} tmpScript **/
          const tmpScript = scriptsLoader.shadowScriptsNodes.splice(0, 1)[0]
          loadedAssetsList.push(getNodeSlug(tmpScript))

          if (tmpScript && tmpScript.src) {
            // Load script from src
            let tmpScriptNode = document.createElement('script')
            tmpScriptNode.async = true
            tmpScriptNode.src = tmpScript.src
            tmpScriptNode.onload = tmpScriptNode.onreadystatechange = function () {
              tmpScriptNode.parentNode && tmpScriptNode.parentNode.removeChild(tmpScriptNode)
              tmpScriptNode = null
              scriptsLoader.loadNext(assetsWindow, ref, finishCb)
            }
            tmpScriptNode.onerror = function () {
              console.warn('Error loading script', tmpScript.src)
              tmpScriptNode.parentNode && tmpScriptNode.parentNode.removeChild(tmpScriptNode)
              tmpScriptNode = null
              scriptsLoader.loadNext(assetsWindow, ref, finishCb)
            }

            ref.append(tmpScriptNode)
          } else {
            // Just append inline
            ref.append(tmpScript)
            scriptsLoader.loadNext(assetsWindow, ref, finishCb)
          }
        } catch (e) {
          console.warn('Failed to loadScript', e)
          scriptsLoader.loadNext(assetsWindow, ref, finishCb)
        }
      } else {
        finishCb && finishCb()
      }
    }
  }

  const renderShadowDom = (data, finishCb) => {
    // Context
    const assetsWindow = window.document.querySelector('.vcv-layout-iframe').contentWindow

    // ### Nodes ### logic:
    // - get all assets
    // - check if it is cached (or ignoreCache)
    // - put css in HEAD
    // - put scripts in data.ref

    // ###SCRIPTS### collect and remove scripts from data.ref
    const shadowScriptNodes = data.shadowDom.find('script')
    shadowScriptNodes.each((index, domNode) => {
      const slug = getNodeSlug(domNode)

      if (!isNodeCached(slug) || data.ignoreCache) {
        // Put scripts to queue, this will also add to loadedAssetsList cache
        scriptsLoader.add(domNode)
      }
      // Will be added later (or already added-cached), remove from shadow dom
      domNode.remove()
    })

    // ###STYLES###
    const shadowStylesNodes = data.shadowDom.find('style,link[href]')
    shadowStylesNodes.each((index, domNode) => {
      const slug = getNodeSlug(domNode)

      // For CSS in case if cached don't append it again
      // In case if data.ignoreCache it will be appended
      if (isNodeCached(slug)) {
        if (!data.ignoreCache) {
          // Already added on page
          domNode.remove()
        }
      } else {
        // Add CSS to Cache list
        loadedAssetsList.push(slug)
      }
    })

    // Append shadowDom to ref
    assetsWindow.jQuery(data.ref).append(data.shadowDom)

    // Append scripts to ref
    scriptsLoader.loadNext(assetsWindow, data.ref, finishCb)
  }

  // Collecting
  cachePageAssets()

  // Event listen
  storage.on('add', renderShadowDom)

  let timer = null
  getStorage('workspace').state('iframe').onChange((data) => {
    if (data && data.type === 'reload') {
      if (timer) {
        window.clearTimeout(timer)
        timer = null
      }
      timer = window.setTimeout(() => {
        loadedAssetsList = []
        cachePageAssets()
      }, 100)
    }
  })
})
