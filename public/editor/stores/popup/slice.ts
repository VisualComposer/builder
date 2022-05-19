import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'popups',
  initialState: {
    isPopupAddInProgress: false
  },
  reducers: {
    popupAddInProgressSet: (data, action) => {
      data.isPopupAddInProgress = action.payload
    }
  }
})

export const { popupAddInProgressSet } = slice.actions
export default slice.reducer
