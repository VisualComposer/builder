/* global describe, test, expect, global */

import '../../public/editor/services/dataManager/service'
import reducer, { assetsAdded } from 'public/editor/stores/sharedAssets/slice'

const initialState = { sharedAssets: {} }

test('should return the initial state', () => {
  expect(reducer(undefined, {})).toEqual(initialState)
})

test('should handle a asset being added to an empty object', () => {
  const assetName = 'animate'
  const assetData = {
    'cssBundle': 'https://vcwb.vc/wp-content/plugins/visualcomposer-dev/public/sources/assetsLibrary/animate/dist/animate.bundle.css',
    'dependencies': [ 'waypoints' ],
    'jsBundle': 'https://vcwb.vc/wp-content/plugins/visualcomposer-dev/public/sources/assetsLibrary/animate/dist/animate.bundle.js'
  }
  const assetToAdd = { name: assetName, ...assetData}

    expect(reducer(initialState, assetsAdded(assetToAdd))).toEqual({ sharedAssets: {[assetName]: assetData} })
})
