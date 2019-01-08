import { addStorage, getService, getStorage, env } from 'vc-cake'

addStorage('shortcodeAssets', (storage) => {
  const utils = getService('utils')

  // new shortcode logic
  let loadedFiles = []
  let collectLoadFiles = () => {
    loadedFiles = []
    const assetsWindow = window.document.querySelector('.vcv-layout-iframe').contentWindow

    let data = {
      domNodes: assetsWindow.document.querySelectorAll('style, link[href], script'),
      cacheInnerHTML: true
    }
    loadFiles(data)
  }

  let scriptsLoader = {
    src: [],
    add: (src) => {
      scriptsLoader.src.push(src)
    },
    loadNext: (assetsWindow) => {
      if (scriptsLoader.src.length) {
        let tmpSrc = scriptsLoader.src.splice(0, 1)
        assetsWindow.jQuery.getScript(tmpSrc).always(() => {
          scriptsLoader.loadNext(assetsWindow)
        })
      }
    }
  }
  let loadFiles = (data) => {
    const assetsWindow = window.document.querySelector('.vcv-layout-iframe').contentWindow
    if (data.domNodes && data.domNodes.length) {
      const allowedHeadTags = [ 'META', 'LINK', 'STYLE', 'SCRIPT' ]
      Array.from(data.domNodes).forEach(domNode => {
        let slug = ''
        let position = ''
        let type = ''
        if (domNode.href && (allowedHeadTags.indexOf(domNode.tagName) > -1)) {
          slug = utils.slugify(domNode.href)
          position = 'head'
          type = 'css'
        } else if (domNode.src) {
          slug = utils.slugify(domNode.src)
          !data.ignoreCache && (position = 'body')
          type = 'js'
        } else if (domNode.id && domNode.type && domNode.type.indexOf('template') >= 0) {
          slug = domNode.id
          position = 'head'
          type = 'template'
        } else if (data.cacheInnerHTML) {
          slug = utils.slugify(domNode.innerHTML || domNode.textContent)
        }

        let cached = slug && slug.length > 0 && loadedFiles.indexOf(slug) >= 0

        // Remove first part of url, because they can differ by CDN and local files
        if (!cached) {
          loadedFiles.forEach((loadedFile) => {
            const cutLoadedFile = loadedFile.split('wp-content')[ 1 ]
            const cutSlug = slug.split('wp-content')[ 1 ]
            if (cutLoadedFile && cutSlug && (cutLoadedFile === cutSlug)) {
              cached = true
            }
          })
        }

        let ignoreCache = type === 'template' ? false : data.ignoreCache
        if (env('FT_IGNORE_ELEMENTS_DOM_CACHE')) {
          ignoreCache = true
        }
        if (!cached || ignoreCache) {
          !ignoreCache && slug && loadedFiles.push(slug)
          if (data.addToDocument) {
            try {
              if (domNode.tagName === 'SCRIPT') {
                if (domNode.src) {
                  scriptsLoader.add(domNode.src)
                } else {
                  data.ref && assetsWindow.jQuery(data.ref) && assetsWindow.jQuery(data.ref).append(domNode)
                }
              } else {
                if (position) {
                  assetsWindow.document[ position ] && assetsWindow.jQuery(assetsWindow.document[ position ]).append(domNode)
                } else {
                  data.ref && assetsWindow.jQuery(data.ref) && assetsWindow.jQuery(data.ref).append(domNode)
                }
              }
            } catch (e) {
              console.warn('Failed to add domNode', e, domNode)
            }
          }
        }
      })
      scriptsLoader.loadNext(assetsWindow)
    }
    assetsWindow.window.vcv && assetsWindow.window.vcv.trigger('ready')
  }

  // Collecting
  collectLoadFiles()

  // Event listen
  storage.on('add', (data) => {
    loadFiles(data)
  })

  let timer = null
  getStorage('workspace').state('iframe').onChange((data) => {
    if (data && data.type === 'reload') {
      if (timer) {
        window.clearTimeout(timer)
        timer = null
      }
      timer = window.setTimeout(() => {
        collectLoadFiles()
      }, 100)
    }
  })
})
