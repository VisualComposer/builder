import {addStorage, getService} from 'vc-cake'

addStorage('assets', (storage) => {
  const documentManager = getService('document')
  // const assetsManager = getService('assetsManager')
  const stylesManager = getService('stylesManager')
  const assetsStorage = getService('assetsStorage')
  const globalAssetsStorage = assetsStorage.getGlobalInstance()
  const appAPI = getService('api')
  const data = {elements: {}}
  const domStore = window.document.querySelector('.vcv-layout-iframe').contentWindow.document
  console.log(domStore)
  const buildElementCss = (data) => {
    let styles = stylesManager.create()
    styles.add(globalAssetsStorage.getCssDataByElement(data, { tags: false, attributeMixins: false }))
    styles.compile().then((result) => {
      domStore.getElementById(`css-styles-${data.id}`).innerHTML = result
    }).then(() => {
      appAPI.publicEvents.trigger('css:ready')
    })

    let attributesStyles = stylesManager.create()
    attributesStyles.add(globalAssetsStorage.getCssDataByElement(data, { tags: false, cssMixins: false }))
    attributesStyles.compile().then((result) => {
      console.log(domStore.getElementById(`do-styles-${data.id}`))
      domStore.getElementById(`do-styles-${data.id}`).innerHTML = result
    }).then(() => {
      domStore.defaultView.vcv.trigger('ready', 'update', data.id)
    })
  }
  storage.on('addElement', (id) => {
    let ids = Array.isArray(id) ? id : [id]
    ids.forEach((id) => {
      const element = documentManager.get(id)
      data.elements[id] = element
      const styleElement = domStore.createElement('style')
      styleElement.id = `css-styles-${id}`
      domStore.body.appendChild(styleElement)
      const doStyleElement = domStore.createElement('style')
      doStyleElement.id = `do-styles-${id}`
      domStore.body.appendChild(doStyleElement)
      buildElementCss(element)
    })
  })
  storage.on('updateElement', (id) => {
    let ids = Array.isArray(id) ? id : [id]
    ids.forEach((id) => {
      const element = documentManager.get(id)
      data.elements[id] = documentManager.get(id)
      buildElementCss(element)
    })
  })
  storage.on('removeElement', (id) => {
    let ids = Array.isArray(id) ? id : [id]
    ids.forEach((id) => {
      delete data.elements[id]
    })
  })
})
