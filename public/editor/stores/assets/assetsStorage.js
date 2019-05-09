import { addStorage, getService, getStorage } from 'vc-cake'

import CssBuilder from './lib/cssBuilder'
import AssetsLibraryManager from './lib/assetsLibraryManager'

addStorage('assets', (storage) => {
  const cook = getService('cook')
  const documentManager = getService('document')
  const stylesManager = getService('stylesManager')
  const elementAssetsLibrary = getService('elementAssetsLibrary')
  const assetsStorage = getService('modernAssetsStorage')
  const utils = getService('utils')
  const globalAssetsStorage = assetsStorage.create()
  const settingsStorage = getStorage('settings')
  const assetsWindow = window.document.querySelector('.vcv-layout-iframe').contentWindow
  const assetsLibraryManager = new AssetsLibraryManager()
  const data = { elements: {} }
  let builder = new CssBuilder(globalAssetsStorage, elementAssetsLibrary, stylesManager, assetsWindow, utils.slugify)

  builder.buildStylesContainers()

  storage.on('addElement', (id) => {
    let ids = Array.isArray(id) ? id : [ id ]
    ids.forEach((id) => {
      const element = documentManager.get(id)
      data.elements[ id ] = element
      storage.trigger('addSharedLibrary', element)
      builder.add(element)
    })
  })
  storage.on('updateElement', (id, options) => {
    let ids = Array.isArray(id) ? id : [ id ]
    ids.forEach((id) => {
      const element = documentManager.get(id)
      data.elements[ id ] = element
      storage.trigger('editSharedLibrary', element)
      builder.update(element, options)
    })
  })
  storage.on('removeElement', (id) => {
    let ids = Array.isArray(id) ? id : [ id ]
    ids.forEach((id) => {
      let tag = data.elements[ id ] ? data.elements[ id ].tag : null
      delete data.elements[ id ]
      builder.destroy(id, tag)
      storage.trigger('removeSharedLibrary', id)
    })
  })
  storage.on('reset', () => {
    // New instance required to reset all {CssBuilder} properties
    builder = new CssBuilder(globalAssetsStorage, elementAssetsLibrary, stylesManager, assetsWindow, utils.slugify)
    builder.buildStylesContainers()
  })
  storage.on('updateAllElements', (data) => {
    Object.values(data).forEach(element => {
      storage.trigger('addSharedLibrary', element)
      builder.add(element, true)
    })
  })
  storage.on('addSharedLibrary', (element) => {
    let id = element.id
    assetsLibraryManager.add(id, element)
  })
  storage.on('editSharedLibrary', (element) => {
    let id = element.id
    assetsLibraryManager.edit(id, element)
  })
  storage.on('removeSharedLibrary', (id) => {
    assetsLibraryManager.remove(id)
  })
  const updateSettingsCss = () => {
    const globalCss = settingsStorage.state('globalCss').get() || ''
    const customCss = settingsStorage.state('customCss').get() || ''
    builder.updateSettingsStyles(globalCss + customCss)
  }
  settingsStorage.state('globalCss').onChange(updateSettingsCss)
  settingsStorage.state('customCss').onChange(updateSettingsCss)

  const updateMixinsState = (cookElement) => {
    let cssMixins = storage.state('cssMixins').get() || {}
    cssMixins[ cookElement.get('id') ] = globalAssetsStorage.getCssMixinsByElement(cookElement.toJS())
    storage.state('cssMixins').set(cssMixins)
  }

  const updateMixins = (id) => {
    const cookElement = cook.getById(id)
    updateMixinsState(cookElement)
  }
  const updateMixinsByData = (data) => {
    const cookElement = cook.get(data)
    updateMixinsState(cookElement)
  }
  const removeMixins = (id) => {
    let cssMixins = storage.state('cssMixins').get() || {}
    delete cssMixins[ id ]

    storage.state('cssMixins').set(cssMixins)
  }
  storage.on('addElement', updateMixins)
  storage.on('updateElement', updateMixins)
  storage.on('updateInnerElementByData', updateMixinsByData)
  storage.on('removeElement', removeMixins)
})
