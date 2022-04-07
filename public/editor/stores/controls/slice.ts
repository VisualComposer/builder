import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'controls',
  initialState: {
    controlsData: {},
    appendControlData: {},
    resizeControlData: {},
    columnResizeData: {},
    outlineData: {}
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
    },
    columnResizeDataChanged: (data, action) => {
      data.columnResizeData = action.payload
    },
    outlineDataChanged: (data, action) => {
      data.outlineData = action.payload
    }
  }
})

export const {
  controlsDataChanged,
  appendControlDataChanged,
  resizeControlDataChanged,
  columnResizeDataChanged,
  outlineDataChanged
} = slice.actions
export default slice.reducer
