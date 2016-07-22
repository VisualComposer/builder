import vcCake from 'vc-cake'

vcCake.add('content-local-storage-data-load', (api) => {
  api.reply('start', () => {
    let localStorage = vcCake.getService('local-storage')
    let timeMachine = vcCake.getService('time-machine')
    let data = localStorage.get()
    timeMachine.setZeroState(data)
    api.request('data:reset', data)
  })
})
