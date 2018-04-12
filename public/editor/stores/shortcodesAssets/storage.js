import { addStorage, getService, getStorage } from 'vc-cake'

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

  let loadFiles = (data) => {
    const assetsWindow = window.document.querySelector('.vcv-layout-iframe').contentWindow
    if (data.domNodes && data.domNodes.length) {
      Array.from(data.domNodes).forEach(domNode => {
        let slug = ''
        let position = ''
        let type = ''
        if (domNode.href) {
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
          slug = utils.slugify(domNode.innerHTML)
        }

        let cached = slug && loadedFiles.indexOf(slug) >= 0
        if (!cached) {
          let ignoreCache = type === 'template' ? false : data.ignoreCache
          !ignoreCache && slug && loadedFiles.push(slug)
          if (data.addToDocument) {
            if (position) {
              assetsWindow.document[ position ] && assetsWindow.jQuery(assetsWindow.document[ position ]).append(domNode)
            } else {
              data.ref && assetsWindow.jQuery(data.ref) && assetsWindow.jQuery(data.ref).append(domNode)
            }
          }
        }
      })
    }
    assetsWindow.window.vcv.trigger('ready')
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
