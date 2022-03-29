import { addStorage } from 'vc-cake'

addStorage('insights', (storage) => {
  storage.state('currentLevel').set('none')
  storage.state('insights').set([])
  storage.on('add', (data) => {
    if (!data || !data.type) {
      return
    }
    let currentLevel = storage.state('currentLevel').get()
    const insights = storage.state('insights').get() || {}
    const insightsKeys = Object.keys(insights)
    const errors = insightsKeys.filter(k => insights[k].state === 'critical' || insights[k].state === 'warning')

    if (data.state === 'critical') {
      currentLevel = 'critical'
    } else if (currentLevel !== 'critical' && data.state === 'warning') {
      currentLevel = 'warning'
    } else if (!errors.length && data.state === 'success') {
      currentLevel = 'success'
    }
    storage.state('currentLevel').set(currentLevel)

    const typeData = data.type // typeContentArea

    if (!insights[typeData]) {
      insights[typeData] = {
        title: data.title,
        description: data.groupDescription,
        state: data.state,
        items: []
      }
    }

    insights[typeData].items.unshift(data)
    storage.state('insights').set(insights)
  })

  storage.on('reset', () => {
    storage.state('currentLevel').set('none')
    storage.state('insights').set({})
  })

  storage.on('remove', (type) => {
    const notifications = storage.state('insights').get()

    Object.keys(notifications).forEach((notification) => {
      if (notification === type) {
        delete notifications[type]
      }
    })

    storage.state('insights').set(notifications)
  })

  storage.state('notifications').set([])
  const seenMessages = JSON.parse(window.localStorage.getItem('vcv-seen-messages'))
  storage.state('seenMessages').set(seenMessages || [])
})
