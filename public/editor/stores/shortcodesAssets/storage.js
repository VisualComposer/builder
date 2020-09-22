import { addStorage, getService, getStorage } from 'vc-cake'

addStorage('shortcodeAssets', (storage) => {
  const utils = getService('utils')

  // new shortcode logic
  let loadedFiles = []
  const collectLoadFiles = () => {
    loadedFiles = []
    const assetsWindow = window.document.querySelector('.vcv-layout-iframe').contentWindow

    const data = {
      domNodes: assetsWindow.document.querySelectorAll('style, link[href], script'),
      cacheInnerHTML: true
    }
    loadFiles(data)
  }

  const scriptsLoader = {
    src: [],
    add: (src, ref) => {
      scriptsLoader.src.push({ src: src, ref: ref })
    },
    loadNext: (assetsWindow, finishCb) => {
      if (scriptsLoader.src.length) {
        const tmpSrc = scriptsLoader.src.splice(0, 1)
        let tmpScript = document.createElement('script')
        tmpScript.async = true
        tmpScript.src = tmpSrc[0].src
        tmpScript.onload = tmpScript.onreadystatechange = function () {
          tmpScript.parentNode && tmpScript.parentNode.removeChild(tmpScript)
          tmpScript = null
          scriptsLoader.loadNext(assetsWindow, finishCb)
        }
        tmpScript.onerror = function () {
          console.warn('Error loading script', tmpSrc[0].src)
          tmpScript.parentNode && tmpScript.parentNode.removeChild(tmpScript)
          tmpScript = null
          scriptsLoader.loadNext(assetsWindow, finishCb)
        }

        tmpSrc[0].ref.insertBefore(tmpScript, tmpSrc[0].ref.firstChild)
      } else {
        finishCb && finishCb()
      }
    }
  }
  const loadFiles = (data, finishCb) => {
    const assetsWindow = window.document.querySelector('.vcv-layout-iframe').contentWindow

    if (data.domNodes && data.domNodes.length) {
      const allowedHeadTags = ['META', 'LINK', 'STYLE', 'SCRIPT']
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
            const cutLoadedFile = loadedFile.split('wp-content')[1]
            const cutSlug = slug.split('wp-content')[1]
            if (cutLoadedFile && cutSlug && (cutLoadedFile === cutSlug)) {
              cached = true
            }
          })
        }

        const ignoreCache = type === 'template' ? false : data.ignoreCache
        if (!cached || ignoreCache) {
          !ignoreCache && slug && loadedFiles.push(slug)
          if (data.addToDocument) {
            try {
              if (domNode.tagName === 'SCRIPT') {
                if (domNode.src) {
                  scriptsLoader.add(domNode.src, data.ref)
                } else {
                  data.ref && assetsWindow.jQuery(data.ref) && assetsWindow.jQuery(data.ref).append(domNode)
                }
              } else {
                if (position) {
                  assetsWindow.document[position] && assetsWindow.jQuery(assetsWindow.document[position]).append(domNode)
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
      scriptsLoader.loadNext(assetsWindow, finishCb)
    } else {
      finishCb && finishCb()
    }
  }

  // Collecting
  collectLoadFiles()

  // Event listen
  storage.on('add', (data, finishCb) => {
    loadFiles(data, finishCb)
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
