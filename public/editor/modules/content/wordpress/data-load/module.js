import vcCake from 'vc-cake'

const TimeMachine = vcCake.getService('time-machine')
const assetsManager = vcCake.getService('assets-manager')
const wipAssetsStorage = vcCake.getService('wipAssetsStorage')
vcCake.add('content-wordpress-data-load', (api) => {
  api.reply('start', () => {
    api.request('wordpress:load')
  })

  api.reply('wordpress:data:loaded', (data) => {
    vcCake.setData('app:dataLoaded', true) // all call of updating data should goes through data state :)
    let { status, request } = data
    if (status === 'success') {
      let responseData = JSON.parse(request || '{}')
      if (responseData.data) {
        let data = JSON.parse(responseData.data ? decodeURIComponent(responseData.data) : '{}')
        // Todo fix saving ( empty Name, params all undefined toJS function)
        TimeMachine.setZeroState(data.elements)
        api.request('data:reset', data.elements)
      } else {
        api.request('data:reset', {})
      }
      if (responseData.globalElements && responseData.globalElements.length) {
        let globalElements = JSON.parse(responseData.globalElements || '{}')
        globalElements && assetsManager.set(globalElements)
        if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
          globalElements && wipAssetsStorage.setElements(globalElements)
        }
      }
      if (responseData.cssSettings && responseData.cssSettings.custom) {
        assetsManager.setCustomCss(responseData.cssSettings.custom)
        if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
          wipAssetsStorage.setCustomCss(responseData.cssSettings.custom)
        }
      }
      if (responseData.cssSettings && responseData.cssSettings.global) {
        assetsManager.setGlobalCss(responseData.cssSettings.global)
        if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
          wipAssetsStorage.setGlobalCss(responseData.cssSettings.global)
        }
      }
      if (responseData.myTemplates && responseData.myTemplates) {
        let templates = JSON.parse(responseData.myTemplates || '{}')
        vcCake.setData('myTemplates', templates)
      }
    } else {
      throw new Error('Failed to load wordpress:data:loaded')
    }
    api.request('wordpress:data:added', true)
  })
})
