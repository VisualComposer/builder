import { addStorage } from 'vc-cake'

addStorage('insights', (storage) => {
  storage.state('currentLevel').set(0)
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
    let currentLevel = storage.state('currentLevel').get()
    // bitwise operator for easier checks
    currentLevel |= data.state === 'success' ? 1 : (data.state === 'warning' ? 2 : 4)
    storage.state('currentLevel').set(currentLevel)

    const insights = storage.state('insights').get() || {}
    const typeData = data.type.split(':') // type:elementId:contentArea

    if (!insights[typeData[0]]) {
      insights[typeData[0]] = {
        title: data.title,
        description: data.groupDescription,
        state: data.state,
        items: []
      }
    }

    const itemsByType = insights[typeData[0]].items
    const updateItemIndex = itemsByType.findIndex(item => item.type === data.type)

    if (updateItemIndex >= 0) { // Already added insight
      itemsByType[updateItemIndex] = data
      storage.state('insights').set(insights)
    } else {
      itemsByType.push(data)
      storage.state('insights').set(insights)
    }
  })

  storage.on('remove', (type) => {
    console.log('remove by type', type)
    // const insights = storage.state('insights').get() || {}

    // const removeItemIndex = insights.findIndex(item => item.type === type)
    // if (removeItemIndex >= 0) {
    //   insights.splice(removeItemIndex, 1)
    //   storage.state('insights').set(insights)
    // }
  })

  storage.on('cleanAll', () => {
    storage.state('currentLevel').set(1)
    storage.state('insights').set({})
  })
})
