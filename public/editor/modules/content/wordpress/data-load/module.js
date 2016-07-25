import vcCake from 'vc-cake'

vcCake.add('content-wordpress-data-load', (api) => {
  api.reply('start', () => {
    api.request('wordpress:load')
  })

  api.reply('wordpress:data:loaded', (data) => {
    let elements, timeMachine
    let { status, request } = data

    if (status === 'success') {
      elements = JSON.parse(request.responseText || '{}')
      if (elements) {
        // Todo fix saving ( empty Name, params all undefined toJS function)
        timeMachine = vcCake.getService('time-machine')
        timeMachine.setZeroState(elements)
        api.request('data:reset', elements)
      }
    } else {
      window.console && window.console.error && window.console.error('Failed to load wordpress:data:loaded', data)
    }
  })
})
