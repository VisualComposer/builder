import vcCake from 'vc-cake'

const TimeMachine = vcCake.getService('time-machine')
const assetsManager = vcCake.getService('assets-manager')
vcCake.add('content-wordpress-data-load', (api) => {
  api.reply('start', () => {
    api.request('wordpress:load')
  })

  api.reply('wordpress:data:loaded', (data) => {
    vcCake.setData('app:dataLoaded', true) // all call of updating data should goes through data state :)
    let responseData
    let { status, request } = data
    if (status === 'success') {
      responseData = JSON.parse(request.responseText || '{}')
      if (responseData.data) {
        let data = JSON.parse(responseData.data ? decodeURIComponent(responseData.data) : '{}')
        // Todo fix saving ( empty Name, params all undefined toJS function)
        TimeMachine.setZeroState(data.elements)
        api.request('data:reset', data.elements)
      }
      if (responseData.globalElements && responseData.globalElements.length) {
        let globalElements = JSON.parse(responseData.globalElements || '{}')
        globalElements && assetsManager.set(globalElements)
      }
      if (responseData.cssSettings && responseData.cssSettings.custom) {
        assetsManager.setCustomCss(responseData.cssSettings.custom)
      }
      if (responseData.cssSettings && responseData.cssSettings.global) {
        assetsManager.setGlobalCss(responseData.cssSettings.global)
      }
    } else {
      throw new Error('Failed to load wordpress:data:loaded')
    }
    api.request('wordpress:data:added', true)
  })
})
