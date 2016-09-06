import vcCake from 'vc-cake'
const assetsManager = vcCake.getService('assets-manager')
vcCake.add('content-local-storage-data-load', (api) => {
  api.reply('start', () => {
    const LocalStorage = vcCake.getService('local-storage')
    const TimeMachine = vcCake.getService('time-machine')
    let data = LocalStorage.get()
    TimeMachine.setZeroState(data)
    if (data.data) {
      api.request('data:reset', data.data)
    }
    if (data.elements) {
      assetsManager.set(data.elements)
    }
    api.request('data:added', true)
  })
})
