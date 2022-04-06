/* global describe, test, expect */
import vcCake from 'vc-cake'
import store from '../../public/editor/stores/store'
import { assetsAdded } from '../../public/editor/stores/sharedAssets/slice'

// Skip test with xdescribe (replace to describe later)
describe('Test sharesAssetsStorage', () => {
  global.VCV_GET_SHARED_ASSETS = () => {
    return {
      'animate': {
        'cssBundle': 'https://vcwb.vc/wp-content/plugins/visualcomposer-dev/public/sources/assetsLibrary/animate/dist/animate.bundle.css',
        'dependencies': [ 'waypoints' ],
        'jsBundle': 'https://vcwb.vc/wp-content/plugins/visualcomposer-dev/public/sources/assetsLibrary/animate/dist/animate.bundle.js'
      },
      'waypoints': {
        'cssBundle': '',
        'dependencies': [],
        'jsBundle': 'https://vcwb.vc/wp-content/plugins/visualcomposer-dev/public/sources/assetsLibrary/waypoints/dist/noframework.waypoints.min.js'
      }
    }
  }
  window = global
  // Services & Storages
  require('../../public/editor/services/dataManager/service.js')
  const globalStoreInstance = require('../../editor/stores/globalStoreInstance')
  vcCake.env('globalStore', globalStoreInstance)
  vcCake.env('debug', true)
  vcCake.start(() => {
    test('sharesAssetsStorage start', () => {
      const storageState = store.getState().sharedAssets.sharedAssets
      const globalAssets = global.VCV_GET_SHARED_ASSETS()
      expect(storageState).toEqual(globalAssets)
    })

    test('sharesAssetsStorage add', () => {
      const assetToAdd = {
        'name': 'divider',
        'cssBundle': 'https://vcwb.vc/wp-content/plugins/visualcomposer-dev/public/sources/assetsLibrary/divider/dist/divider.bundle.css',
        'dependencies': [],
        'jsBundle': ''
      }
      store.dispatch(assetsAdded(assetToAdd))
      const storageState = store.getState().sharedAssets.sharedAssets
      expect(assetToAdd).toEqual(storageState[ assetToAdd.name ])
    })
  })
})
