import vcCake from 'vc-cake'
const documentService = vcCake.getService('document')
const assetsManager = vcCake.getService('assets-manager')
const wipAssetsManager = vcCake.getService('wipAssetsManager')
const wipAssetsStorage = vcCake.getService('wipAssetsStorage')
const wipStylesManager = vcCake.getService('wipStylesManager')

const loadedJsFiles = []
const loadedCssFiles = []
vcCake.add('assets', (api) => {
  const dataUpdate = () => {
    let iframeWindow = window.document.querySelector('.vcv-layout-iframe').contentWindow
    let iframeDocument = iframeWindow.document
    let doElement = iframeDocument.querySelector('#do-styles')
    let styleElement = iframeDocument.querySelector('#css-styles')
    if (!styleElement) {
      styleElement = iframeDocument.createElement('style')
      styleElement.id = 'css-styles'
      iframeDocument.body.appendChild(styleElement)
    }
    if (!doElement) {
      doElement = iframeDocument.createElement('style')
      doElement.id = 'do-styles'
      iframeDocument.body.appendChild(doElement)
    }
    assetsManager.getCompiledCss(true).then((result) => {
      styleElement.innerHTML = result
      styleElement.innerHTML += assetsManager.getGlobalCss()
    })

    if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
      let stylesManager = wipStylesManager.create()
      stylesManager.add(wipAssetsStorage.getSiteCssData())
      stylesManager.compile().then((result) => {
        styleElement.innerHTML = result
      })
    }

    assetsManager.getCompiledDesignOptions().then((result) => {
      doElement.innerHTML = result
      doElement.innerHTML += assetsManager.getCustomCss()
    })

    if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
      let stylesManager = wipStylesManager.create()
      stylesManager.add(wipAssetsStorage.getPageCssData())
      stylesManager.compile().then((result) => {
        doElement.innerHTML = result
      })
    }

    var jsAssetsLoaders = []
    let jsFiles = assetsManager.getJsFiles()

    if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
      jsFiles = wipAssetsManager.getJsFilesByTags(wipAssetsStorage.getElementsTagsList())
    }

    jsFiles.forEach((file) => {
      if (loadedJsFiles.indexOf(file) === -1) {
        loadedJsFiles.push(file)
        if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
          jsAssetsLoaders.push(iframeWindow.$.getScript(wipAssetsManager.getSourcePath(file)))
        } else {
          jsAssetsLoaders.push(iframeWindow.$.getScript(assetsManager.getSourcePath(file)))
        }
      }
    })
    Promise.all(jsAssetsLoaders).then(() => {
      iframeWindow.vcv.trigger('ready')
    })

    let d = iframeWindow.document

    let cssFiles = assetsManager.getCssFiles()

    if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
      cssFiles = wipAssetsManager.getCssFilesByTags(wipAssetsStorage.getElementsTagsList())
    }

    cssFiles.forEach((file) => {
      if (loadedCssFiles.indexOf(file) === -1) {
        loadedCssFiles.push(file)
        let cssLink = d.createElement('link')
        cssLink.setAttribute('rel', 'stylesheet')
        if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
          cssLink.setAttribute('href', wipAssetsManager.getSourcePath(file))
        } else {
          cssLink.setAttribute('href', assetsManager.getSourcePath(file))
        }
        d.querySelector('head').appendChild(cssLink)
      }
    })
  }
  // TODO: Use state against event
  api.reply('data:changed', dataUpdate)
  api.reply('settings:changed', dataUpdate)
  api.reply('wordpress:data:added', dataUpdate)
  api.reply('data:added', dataUpdate)

  api.reply('data:afterAdd', (ids) => {
    assetsManager.add(ids)
    if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
      wipAssetsStorage.addElement(ids)
    }
  })

  api.reply('data:afterUpdate', (id, element) => {
    assetsManager.update(id)
    if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
      wipAssetsStorage.updateElement(id)
    }
  })

  api.reply('data:beforeRemove', (id) => {
    let elements = []
    let walkChildren = (id) => {
      elements.push(id)
      let children = documentService.children(id)
      children.forEach((child) => {
        walkChildren(child.id)
      })
    }
    walkChildren(id)
    assetsManager.remove(elements)
    if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
      wipAssetsStorage.removeElement(elements)
    }
  })

  api.reply('node:beforeSave', (data) => {
    if (data.hasOwnProperty('pageElements')) {
      let elements = []
      for (let id in data.pageElements) {
        if (data.pageElements[ id ].hasOwnProperty('tag')) {
          elements.push(id)
        }
      }
      assetsManager.update(elements)
      if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
        wipAssetsStorage.updateElement(elements)
      }
    }
  })

  api.reply('wordpress:beforeSave', (data) => {
    if (data.hasOwnProperty('pageElements')) {
      let elements = []
      for (let id in data.pageElements) {
        if (data.pageElements[ id ].hasOwnProperty('tag')) {
          elements.push(id)
        }
      }
      assetsManager.update(elements)
      if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
        wipAssetsStorage.updateElement(elements)
      }
    }
  })

  api.reply('data:afterClone', (id) => {
    let elements = []
    let walkChildren = (id) => {
      elements.push(id)
      let children = documentService.children(id)
      children.forEach((child) => {
        walkChildren(child.id)
      })
    }
    walkChildren(id)
    assetsManager.add(elements)
    if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
      wipAssetsStorage.addElement(elements)
    }
  })
})
