import { addStorage, getService, getStorage, setData, env } from 'vc-cake'

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
    localStorage.save({
      data: data,
      cssSettings: {
        custom: settingsStorage.state('customCss').get(),
        global: settingsStorage.state('globalCss').get()
      },
      jsSettings: {
        local: (env('CUSTOM_JS') && settingsStorage.state('localJs').get()) || '',
        global: (env('CUSTOM_JS') && settingsStorage.state('globalJs').get()) || ''
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
    if (env('CUSTOM_JS')) {
      if (data.jsSettings && data.jsSettings.local) {
        settingsStorage.state('localJs').set(data.jsSettings.local)
      }
      if (data.jsSettings && data.jsSettings.global) {
        settingsStorage.state('globalJs').set(data.jsSettings.global)
      }
    }
    if (data.myTemplates) {
      setData('myTemplates', data.myTemplates)
    }
  })
})
