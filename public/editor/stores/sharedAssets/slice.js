import { createSlice } from '@reduxjs/toolkit'
import { getService } from 'vc-cake'

const dataManager = getService('dataManager')

const slice = createSlice({
  name: 'sharedAssets',
  initialState: {
    sharedAssets: dataManager.get('getSharedAssets')
  },
  reducers: {
    assetsAdded: (data, action) => {
      data.sharedAssets[action.payload.name] = action.payload
    }
  }
})

export const { assetsAdded } = slice.actions
export default slice.reducer
