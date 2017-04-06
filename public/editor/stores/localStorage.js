import {addStorage, getService, getStorage, setData} from 'vc-cake'

addStorage('localStorage', (storage) => {
  const documentManager = getService('document')
  const localStorage = getService('localStorage')
  const elementsStorage = getStorage('elements')
  const workspaceStorage = getStorage('workspace')
  const settingsStorage = getStorage('settings')
  const modernAssetsStorage = getService('modernAssetsStorage')
  storage.on('save', () => {
    const data = documentManager.all()
    storage.trigger('node:beforeSave', { // remove this
      pageElements: data
    })
    console.log({
      data: data,
      cssSettings: {
        custom: settingsStorage.state('customCss').get(),
        global: settingsStorage.state('globalCss').get()
      }
    })
    localStorage.save({
      data: data,
      cssSettings: {
        custom: settingsStorage.state('customCss').get(),
        global: settingsStorage.state('globalCss').get()
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
    workspaceStorage.state('app').set('dataLoaded')
    const globalAssetsStorage = modernAssetsStorage.getGlobalInstance()
    // setData('app:dataLoaded', true) // all call of updating data should goes through data state :)
    if (data.elements) {
      globalAssetsStorage.setElements(data.elements)
    }
    if (data.cssSettings && data.cssSettings.custom) {
      settingsStorage.state('customCss').set(data.cssSettings.custom)
    }
    if (data.cssSettings && data.cssSettings.global) {
      settingsStorage.state('globalCss').set(data.cssSettings.global)
    }
    if (data.myTemplates) {
      setData('myTemplates', data.myTemplates)
    }
  })
})
