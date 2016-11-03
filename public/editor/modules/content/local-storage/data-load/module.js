import vcCake from 'vc-cake'
const assetsManager = vcCake.getService('assets-manager')
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
    }
    if (data.elements) {
      assetsManager.set(data.elements)
      if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
        wipAssetsStorage.set(data.elements)
      }
    }
    if (data.cssSettings && data.cssSettings.custom) {
      assetsManager.setCustomCss(data.cssSettings.custom)
      if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
        wipAssetsStorage.setCustomCss(data.cssSettings.custom)
      }
    }
    if (data.cssSettings && data.cssSettings.global) {
      assetsManager.setGlobalCss(data.cssSettings.global)
      if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
        wipAssetsStorage.setGlobalCss(data.cssSettings.global)
      }
    }
    api.request('data:added', true)
  })
})
