import {addStorage, getService, env} from 'vc-cake'

addStorage('shortcodeAssets', (storage) => {
  const utils = getService('utils')
  const assetsWindow = window.document.querySelector('.vcv-layout-iframe').contentWindow

  if (!env('FE_SHORTCODES_SCRIPTS')) {
    let loadedCssFiles = []
    let loadedJsFiles = []

    let collectLoadFiles = () => {
      let data = {
        cssBundles: assetsWindow.jQuery('style, link[href]'),
        jsBundles: assetsWindow.jQuery('script')
      }
      loadFiles(data, false)
    }
    let loadFiles = (data, addToDocument) => {
      if (data.cssBundles && data.cssBundles.length) {
        // it is jquery
        data.cssBundles.each((i, cssNode) => {
          let $el = assetsWindow.jQuery(cssNode)
          let slug = ''
          if ($el.is('style')) {
            // inline
            slug = utils.slugify(cssNode.innerHTML)
          } else if ($el.is('link[href]')) {
            // load href
            slug = utils.slugify($el.attr('href'))
          }

          // let slug = utils.slugify(file)
          if (loadedCssFiles.indexOf(slug) === -1) {
            loadedCssFiles.push(slug)
            if (addToDocument) {
              assetsWindow.document.head.appendChild(cssNode)
            }
          }
        })
      }
      if (data.jsBundles && data.jsBundles.length) {
        // use each, it is jquery
        data.jsBundles.each(
          (i, jsNode) => {
            let $el = assetsWindow.jQuery(jsNode)
            let slug = ''
            if ($el.is('script[src]')) {
              // inline
              slug = utils.slugify($el.attr('src'))
            } else {
              // load href
              slug = utils.slugify(jsNode.innerHTML)
            }
            if (loadedJsFiles.indexOf(slug) === -1) {
              loadedJsFiles.push(slug)
              if (addToDocument) {
                $el.insertAfter(assetsWindow.document.head)
              }
            }
          }
        )
      }
    }

    // Collecting
    collectLoadFiles()

    // Event listen
    storage.on('add', (data) => {
      loadFiles(data, true)
    })
  } else {
    // new shortcode logic
    ((window, document) => {
      let loadedFiles = []

      let collectLoadFiles = () => {
        let data = {
          domNodes: document.querySelectorAll('style, link[href], script'),
          cacheInnerHTML: true
        }
        loadFiles(data)
      }

      let loadFiles = (data) => {
        if (data.domNodes && data.domNodes.length) {
          Array.from(data.domNodes).forEach(domNode => {
            let slug = ''
            let position = ''
            if (domNode.href) {
              slug = utils.slugify(domNode.href)
              position = 'head'
            } else if (domNode.src) {
              slug = utils.slugify(domNode.src)
              position = 'body'
            } else if (data.cacheInnerHTML) {
              slug = utils.slugify(domNode.innerHTML)
            }
            let cached = slug && loadedFiles.indexOf(slug) >= 0
            if (!cached) {
              !data.ignoreCache && slug && loadedFiles.push(slug)
              if (data.addToDocument) {
                if (position) {
                  // document[position] && document[position].appendChild(domNode)
                  document[position] && window.jQuery(document[position]).append(domNode)
                } else {
                  // data.ref && data.ref.appendChild(domNode)
                  data.ref && window.jQuery(data.ref).append(domNode)
                }
              }
            }
          })
        }
      }

      // Collecting
      collectLoadFiles()

      // Event listen
      storage.on('add', (data) => {
        loadFiles(data)
      })
    })(assetsWindow, assetsWindow.document)
  }
})
