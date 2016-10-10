import vcCake from 'vc-cake'
const documentService = vcCake.getService('document')
const assetManager = vcCake.getService('assets-manager')
const loadedJsFiles = []
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
    assetManager.getCompiledCss().then((result) => {
      styleElement.innerHTML = result
    })
    assetManager.getCompiledDesignOptions().then((result) => {
      doElement.innerHTML = result + assetManager.getGlobalCss() + assetManager.getCustomCss()
    })
    var jsAssetsLoaders = []
    assetManager.getJsFiles().forEach((file) => {
      if (loadedJsFiles.indexOf(file) === -1) {
        loadedJsFiles.push(file)
        jsAssetsLoaders.push(iframeWindow.$.getScript(assetManager.getSourcePath(file)))
      }
    })
    Promise.all(jsAssetsLoaders).then(() => {
      iframeWindow.vcv.trigger('ready')
    })
  }
  // TODO: Use state against event
  api.reply('data:changed', dataUpdate)
  api.reply('settings:changed', dataUpdate)
  api.reply('wordpress:data:added', dataUpdate)
  api.reply('data:added', dataUpdate)

  api.reply('data:afterAdd', (ids) => {
    assetManager.add(ids)
  })

  api.reply('data:afterUpdate', (id, element) => {
    assetManager.update(id)
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
    assetManager.remove(elements)
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
    assetManager.add(elements)
  })
})
