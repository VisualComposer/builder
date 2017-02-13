import vcCake from 'vc-cake'
const wipAssetsStorage = vcCake.getService('wipAssetsStorage')
vcCake.add('content-local-storage-data-load', (api) => {
  api.reply('start', () => {
    vcCake.setData('app:dataLoaded', true) // all call of updating data should goes through data state :)
    const LocalStorage = vcCake.getService('local-storage')
    const TimeMachine = vcCake.getService('time-machine')
    let data = LocalStorage.get()
    TimeMachine.setZeroState(data.data)
    if (data.data) {
      api.request('data:reset', data.data)
    } else {
      api.request('data:reset', {})
    }
    if (data.elements) {
      wipAssetsStorage.setElements(data.elements)
    }
    if (data.cssSettings && data.cssSettings.custom) {
      wipAssetsStorage.setCustomCss(data.cssSettings.custom)
    }
    if (data.cssSettings && data.cssSettings.global) {
      wipAssetsStorage.setGlobalCss(data.cssSettings.global)
    }
    if (data.myTemplates) {
      vcCake.setData('myTemplates', data.myTemplates)
    }
    api.request('data:added', true)
  })
})
