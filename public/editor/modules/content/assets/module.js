import vcCake from 'vc-cake'

const documentService = vcCake.getService('document')
const assetManager = vcCake.getService('assets-manager')

vcCake.add('assets', (api) => {
  api.reply('data:changed', () => {
    let iframeDocument = window.document.querySelector('.vcv-layout-iframe').contentWindow.document
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
      doElement.innerHTML = result
    })
  })

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
