import vcCake from 'vc-cake'
const documentService = vcCake.getService('document')
const wipAssetsManager = vcCake.getService('wipAssetsManager')
const wipAssetsStorage = vcCake.getService('wipAssetsStorage')
const wipStylesManager = vcCake.getService('wipStylesManager')

const loadedCssFiles = []
vcCake.add('assets', (api) => {
  const dataUpdate = (data, action, id) => {
    let doElement = document.querySelector('#do-styles')
    let styleElement = document.querySelector('#css-styles')
    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = 'css-styles'
      document.body.appendChild(styleElement)
    }
    if (!doElement) {
      doElement = document.createElement('style')
      doElement.id = 'do-styles'
      document.body.appendChild(doElement)
    }

    let siteStylesManager = wipStylesManager.create()
    siteStylesManager.add(wipAssetsStorage.getWpBackendSiteCssData())
    siteStylesManager.compile().then((result) => {
      styleElement.innerHTML = result
    })

    let pageStylesManager = wipStylesManager.create()
    pageStylesManager.add(wipAssetsStorage.getWpBackendPageCssData())
    pageStylesManager.compile().then((result) => {
      doElement.innerHTML = result
    })

    let d = window.document

    let cssFiles = wipAssetsManager.getCssFilesByTags(wipAssetsStorage.getElementsTagsList())

    cssFiles.forEach((file) => {
      if (loadedCssFiles.indexOf(file) === -1) {
        loadedCssFiles.push(file)
        let cssLink = d.createElement('link')
        cssLink.setAttribute('rel', 'stylesheet')
        cssLink.setAttribute('href', wipAssetsManager.getSourcePath(file))
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
