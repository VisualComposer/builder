import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'controls',
  initialState: {
    controlsData: {},
    appendControlData: {},
    resizeControlData: {}
  },
  reducers: {
    controlsDataChanged: (data, action) => {
      data.controlsData = action.payload
    },
    appendControlDataChanged: (data, action) => {
      data.appendControlData = action.payload
    },
    resizeControlDataChanged: (data, action) => {
      data.resizeControlData = action.payload
    }
  }
})

export const {
  controlsDataChanged,
  appendControlDataChanged,
  resizeControlDataChanged
} = slice.actions
export default slice.reducer
