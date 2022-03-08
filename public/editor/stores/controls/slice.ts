import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'controls',
  initialState: {
    controlsData: {},
    appendControlData: {}
  },
  reducers: {
    controlsDataChanged: (data, action) => {
      data.controlsData = action.payload
    },
    appendControlDataChanged: (data, action) => {
      data.appendControlData = action.payload
    }
  }
})

export const { controlsDataChanged, appendControlDataChanged } = slice.actions
export default slice.reducer
