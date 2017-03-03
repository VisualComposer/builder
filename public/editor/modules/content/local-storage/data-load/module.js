import vcCake from 'vc-cake'
const assetsStorage = vcCake.getService('assetsStorage')
vcCake.add('content-local-storage-data-load', (api) => {
  api.reply('start', () => {
    vcCake.setData('app:dataLoaded', true) // all call of updating data should goes through data state :)
    const LocalStorage = vcCake.getService('local-storage')
    const TimeMachine = vcCake.getService('time-machine')
    const globalAssetsStorage = assetsStorage.create()
    vcCake.setData('globalAssetsStorage', globalAssetsStorage)
    let data = LocalStorage.get()
    TimeMachine.setZeroState(data.data)
    if (data.data) {
      api.request('data:reset', data.data)
    } else {
      api.request('data:reset', {})
    }
    if (data.elements) {
      globalAssetsStorage.setElements(data.elements)
    }
    if (data.cssSettings && data.cssSettings.custom) {
      globalAssetsStorage.setCustomCss(data.cssSettings.custom)
    }
    if (data.cssSettings && data.cssSettings.global) {
      globalAssetsStorage.setGlobalCss(data.cssSettings.global)
    }
    if (data.myTemplates) {
      vcCake.setData('myTemplates', data.myTemplates)
    }
    api.request('data:added', true)
  })
})
