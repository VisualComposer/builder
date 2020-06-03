import { addStorage } from 'vc-cake'

addStorage('insights', (storage) => {
  storage.state('insights').set([])
  storage.on('add', (data) => {
    // data example
    // {
    //   state: 'warning' || 'critical' || 'success',
    //   title: 'Title text'
    //   description: 'Description text',
    //   type: 'insightID'
    //   elementID: 'someElement'
    // }

    if (!data || !data.type) {
      return
    }

    const insights = storage.state('insights').get() || []
    const updateItemIndex = insights.findIndex(item => item.type === data.type)

    if (updateItemIndex >= 0) { // Already added insight
      insights[updateItemIndex] = data
      storage.state('notifications').set(insights)
    } else {
      insights.push(data)
      storage.state('insights').set(insights)
    }
  })

  storage.on('remove', (type) => {
    const insights = storage.state('insights').get()

    const removeItemIndex = insights.findIndex(item => item.type === type)
    if (removeItemIndex >= 0) {
      insights.splice(removeItemIndex, 1)
      storage.state('notifications').set(insights)
    }
  })

  storage.on('cleanAll', () => {
    storage.state('insights').set([])
  })
})
