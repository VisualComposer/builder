import {addStorage, getService, getStorage} from 'vc-cake'

addStorage('localStorage', (storage) => {
  const documentManager = getService('document')
  const localStorage = getService('localStorage')
  const elementsStorage = getStorage('elements')
  storage.on('save', () => {
    const data = documentManager.all()
    storage.trigger('node:beforeSave', { // remove this
      pageElements: data
    })
    localStorage.save({
      data: data,
      cssSettings: {
        custom: '', // assetsStorage.getCustomCss(),
        global: '' // assetsStorage.getGlobalCss()
      }
    })
  })
  storage.on('templates:save', () => {
    localStorage.save({
      myTemplates: '' // myTemplates.all()
    })
  })
  storage.on('templates:remove', () => {
    localStorage.save({
      myTemplates: '' // myTemplates.all()
    })
  })
  storage.on('start', () => {
    let data = localStorage.get()
    elementsStorage.trigger('reset', data.data || {})
    // vcCake.setData('app:dataLoaded', true) // all call of updating data should goes through data state :)

    /*
    if (data.elements) {
      assetsStorage.setElements(data.elements)
    }
    if (data.cssSettings && data.cssSettings.custom) {
      assetsStorage.setCustomCss(data.cssSettings.custom)
    }
    if (data.cssSettings && data.cssSettings.global) {
      assetsStorage.setGlobalCss(data.cssSettings.global)
    }
    if (data.myTemplates) {
      vcCake.setData('myTemplates', data.myTemplates)
    }
    api.request('data:added', true)
    */
  })
})
