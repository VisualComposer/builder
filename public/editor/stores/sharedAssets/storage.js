import { addStorage } from 'vc-cake'

addStorage('sharedAssets', (storage) => {
  storage.on('start', () => {
    storage.state('sharedAssets').set(window && window.VCV_GET_SHARED_ASSETS ? window.VCV_GET_SHARED_ASSETS() : {})
  })

  storage.on('add', (assetsData) => {
    const sharedAssets = storage.state('sharedAssets').get() || {}
    sharedAssets[assetsData.name] = assetsData
    storage.state('sharedAssets').set(sharedAssets)
  })
})
