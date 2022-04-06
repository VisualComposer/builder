import { createSlice } from '@reduxjs/toolkit'
import { getService } from 'vc-cake'

const dataManager = getService('dataManager')

interface Popup {
  visible: boolean,
  priority: number,
  voteValue?: any
}

export interface Popups {
  [key:string]: Popup,
}

const getActivePopup = (popupData: Popups): string => {
  const popupDataByPriority = []
  for (const popupName in popupData) {
    if (Object.prototype.hasOwnProperty.call(popupData, popupName)) {
      popupDataByPriority.push({ popupName: popupName, popupData: popupData[popupName] })
    }
  }

  popupDataByPriority.sort((a, b) => a.popupData.priority - b.popupData.priority)
  const firstVisible = popupDataByPriority.findIndex((item) => item.popupData.visible)

  let activePopup = ''
  if (firstVisible >= 0 && popupDataByPriority[firstVisible]) {
    activePopup = popupDataByPriority[firstVisible].popupName
  }
  return activePopup
}

const initialState = {
  popups: {
    votePopup: {
      visible: dataManager.get('showFeedbackForm'),
      priority: 1
    },
    reviewPopup: {
      visible: false,
      priority: 2
    },
    dataCollectionPopup: {
      visible: dataManager?.get('showDataCollectionPopup'),
      priority: 3
    },
    pricingPopup: {
      visible: !!dataManager?.get('showPricingPopup'),
      priority: 4
    },
    premiumPromoPopup: {
      visible: dataManager?.get('showPremiumPromoPopup'),
      priority: 5
    }
  },
  fullScreenPopupData: {},
  activeFullPopup: '',
  activePopup: '',
  isPopupVisible: false
}

initialState.activePopup = getActivePopup(initialState.popups)

const slice = createSlice({
  name: 'editorPopup',
  initialState,
  reducers: {
    popupShown: (data, action) => {
      const popupName = action.payload
      const popups: Popups = data.popups
      if (popupName && popups[popupName]) {
        popups[popupName].visible = true
      }
      data.activePopup = getActivePopup(data.popups)
    },
    popupVisibilitySet: (data, action) => {
      data.isPopupVisible = action.payload
    },
    popupHidden: (data, action) => {
      const popupName = action.payload
      const popups: Popups = data.popups
      if (popupName && popups[popupName]) {
        popups[popupName].visible = false
      }
      data.activePopup = getActivePopup(data.popups)
    },
    allPopupsHidden: (data) => {
      const popups: Popups = data.popups
      Object.keys(data.popups).forEach((popupName) => {
      popups[popupName].visible = false
      })
      data.activePopup = getActivePopup(data.popups)
    },
    popupsSet: (data, action) => {
      data.popups = action.payload
      data.activePopup = getActivePopup(data.popups)
    },
    activeFullPopupSet: (data, action) => {
      data.activeFullPopup = action.payload
    },
    fullScreenPopupDataSet: (data, action) => {
      data.fullScreenPopupData = action.payload
    }
  }
})

export const { popupShown, popupHidden, allPopupsHidden, popupVisibilitySet, popupsSet, activeFullPopupSet, fullScreenPopupDataSet } = slice.actions
export default slice.reducer
