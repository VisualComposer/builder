import vcCake from 'vc-cake'

const TimeMachine = vcCake.getService('time-machine')

vcCake.add('content-wordpress-data-load', (api) => {
  api.reply('start', () => {
    api.request('wordpress:load')
  })

  api.reply('wordpress:data:loaded', (data) => {
    let elements
    let { status, request } = data

    if (status === 'success') {
      elements = JSON.parse(request.responseText || '{}')
      if (elements) {
        // Todo fix saving ( empty Name, params all undefined toJS function)
        TimeMachine.setZeroState(elements)
        api.request('data:reset', elements)
      }
    } else {
      throw new Error('Failed to load wordpress:data:loaded')
    }
  })
})
