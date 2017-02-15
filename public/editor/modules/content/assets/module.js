import vcCake from 'vc-cake'
const documentService = vcCake.getService('document')
const assetsManager = vcCake.getService('assetsManager')
const wipAssetsStorage = vcCake.getService('wipAssetsStorage')
const wipStylesManager = vcCake.getService('wipStylesManager')

const loadedJsFiles = []
const loadedCssFiles = []
vcCake.add('assets', (api) => {
  let iframeWindow = window.document.querySelector('.vcv-layout-iframe').contentWindow
  let iframeDocument = iframeWindow.document
  let doElement = iframeDocument.querySelector('#do-styles')
  let styleElement = iframeDocument.querySelector('#css-styles')
  let doInstantCssStyle = iframeDocument.getElementById('do-css-instant-styles')
  let instantCssStyle = iframeDocument.getElementById('css-instant-styles')
  const dataUpdate = (data, action, id) => {
    if (action === 'reset') {
      wipAssetsStorage.resetElements(Object.keys(documentService.all()))
    }
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
    if (instantCssStyle) {
      instantCssStyle.innerHTML = ''
    }
    if (doInstantCssStyle) {
      doInstantCssStyle.innerHTML = ''
    }

    let siteStylesManager = wipStylesManager.create()
    siteStylesManager.add(wipAssetsStorage.getSiteCssData(true))
    siteStylesManager.compile().then((result) => {
      styleElement.innerHTML = result
    })

    let pageStylesManager = wipStylesManager.create()
    pageStylesManager.add(wipAssetsStorage.getPageCssData())
    pageStylesManager.compile().then((result) => {
      doElement.innerHTML = result
    })

    let jsAssetsLoaders = []
    let jsFiles = assetsManager.getJsFilesByTags(wipAssetsStorage.getElementsTagsList())

    jsFiles.forEach((file) => {
      if (loadedJsFiles.indexOf(file) === -1) {
        loadedJsFiles.push(file)
        jsAssetsLoaders.push(iframeWindow.$.getScript(assetsManager.getSourcePath(file)))
      }
    })
    Promise.all(jsAssetsLoaders).then(() => {
      iframeWindow.vcv.trigger('ready', action, id)
    })
    let d = iframeWindow.document

    let cssFiles = assetsManager.getCssFilesByTags(wipAssetsStorage.getElementsTagsList())

    cssFiles.forEach((file) => {
      if (loadedCssFiles.indexOf(file) === -1) {
        loadedCssFiles.push(file)
        let cssLink = d.createElement('link')
        cssLink.setAttribute('rel', 'stylesheet')
        cssLink.setAttribute('href', assetsManager.getSourcePath(file))
        d.querySelector('head').appendChild(cssLink)
      }
    })
  }
  const instantMutationUpdate = (data) => {
    if (!instantCssStyle) {
      instantCssStyle = iframeDocument.createElement('style')
      instantCssStyle.id = 'css-instant-styles'
      iframeDocument.body.appendChild(instantCssStyle)
    } else if (!data) {
      instantCssStyle.innerHTML = ''
    }
    if (!doInstantCssStyle) {
      doInstantCssStyle = iframeDocument.createElement('style')
      doInstantCssStyle.id = 'do-css-instant-styles'
      iframeDocument.body.appendChild(doInstantCssStyle)
    } else if (!data) {
      doInstantCssStyle.innerHTML = ''
    }
    if (!data) {
      return
    }

    let instantStylesManager = wipStylesManager.create()
    instantStylesManager.add(wipAssetsStorage.getCssDataByElement(data, { tags: false, attributeMixins: false }))
    instantStylesManager.compile().then((result) => {
      instantCssStyle.innerHTML = result
    }).then(() => {
      vcCake.getService('api').publicEvents.trigger('css:ready')
    })

    let attributesStylesManager = wipStylesManager.create()
    attributesStylesManager.add(wipAssetsStorage.getCssDataByElement(data, { tags: false, cssMixins: false }))
    attributesStylesManager.compile().then((result) => {
      doInstantCssStyle.innerHTML = result
    }).then(() => {
      iframeWindow.vcv.trigger('ready', 'update', data.id)
    })
  }
  // TODO: Use state against event
  api.reply('data:changed', dataUpdate)
  api.reply('settings:changed', dataUpdate)
  api.reply('wordpress:data:added', dataUpdate)
  api.reply('data:added', dataUpdate)
  if (vcCake.env('FEATURE_INSTANT_UPDATE')) {
    api.reply('data:instantMutation', instantMutationUpdate)
  }
  api.reply('data:afterAdd', (ids) => {
    wipAssetsStorage.addElement(ids)
  })

  api.reply('data:afterUpdate', (id, element) => {
    wipAssetsStorage.updateElement(id)
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
    wipAssetsStorage.removeElement(elements)
  })

  api.reply('node:beforeSave', (data) => {
    if (data.hasOwnProperty('pageElements')) {
      let elements = []
      for (let id in data.pageElements) {
        if (data.pageElements[ id ].hasOwnProperty('tag')) {
          elements.push(id)
        }
      }
      wipAssetsStorage.updateElement(elements)
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
      wipAssetsStorage.updateElement(elements)
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
    wipAssetsStorage.addElement(elements)
  })
})
const resetURLWithFragment = () => {
  window.location.href.indexOf('#') > -1 && window.history.pushState('', document.title, window.location.pathname +
    window.location.search)
}
window.onpopstate = resetURLWithFragment
resetURLWithFragment()
