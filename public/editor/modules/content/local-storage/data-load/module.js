import vcCake from 'vc-cake'
const assetsManager = vcCake.getService('assets-manager')
vcCake.add('content-local-storage-data-load', (api) => {
  api.reply('start', () => {
    const LocalStorage = vcCake.getService('local-storage')
    const TimeMachine = vcCake.getService('time-machine')
    let data = LocalStorage.get()
    TimeMachine.setZeroState(data.data)
    if (data.data) {
      api.request('data:reset', data.data)
    }
    if (data.elements) {
      assetsManager.set(data.elements)
    }
    if (data.cssSettings && data.cssSettings.custom) {
      assetsManager.setCustomCss(data.cssSettings.custom)
    }
    if (data.cssSettings && data.cssSettings.global) {
      assetsManager.setGlobalCss(data.cssSettings.global)
    }
    api.request('data:added', true)
  })
})
