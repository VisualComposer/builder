import vcCake from 'vc-cake'

const storage = vcCake.getService('wordpress-storage')

vcCake.add('content-wordpress-data-load', (api) => {
  api.reply('start', () => {
    storage.get((request) => {
      let data = JSON.parse(request.responseText || '{}')
      if (data) {
        // Todo fix saving ( empty Name, params all undefined toJS function)
        let timeMachine = vcCake.getService('time-machine')
        timeMachine.setZeroState(data)
        api.request('data:reset', data)
      }
    })
  })
})
