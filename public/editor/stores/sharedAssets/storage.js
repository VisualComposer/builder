import { addStorage, getService } from 'vc-cake'

addStorage('sharedAssets', (storage) => {
  const dataManager = getService('dataManager')

  storage.on('start', () => {
    storage.state('sharedAssets').set(window && dataManager.get('getSharedAssets'))
  })

  storage.on('add', (assetsData) => {
    const sharedAssets = storage.state('sharedAssets').get() || {}
    sharedAssets[assetsData.name] = assetsData
    storage.state('sharedAssets').set(sharedAssets)
  })
})
