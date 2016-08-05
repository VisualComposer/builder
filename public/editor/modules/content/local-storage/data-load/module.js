import vcCake from 'vc-cake'

vcCake.add('content-local-storage-data-load', (api) => {
  api.reply('start', () => {
    const LocalStorage = vcCake.getService('local-storage')
    const TimeMachine = vcCake.getService('time-machine')
    let data = LocalStorage.get()
    TimeMachine.setZeroState(data)
    api.request('data:reset', data)
  })
})
