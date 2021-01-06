import { addStorage, getService } from 'vc-cake'

addStorage('editorPopup', (storage) => {
  const dataManager = getService('dataManager')

  const getActivePopup = (popupData) => {
    const popupDataByPriority = []
    for (const popupName in popupData) {
      if (Object.prototype.hasOwnProperty.call(popupData, popupName)) {
        popupDataByPriority.push({ popupName: popupName, popupData: popupData[popupName] })
      }
    }

    popupDataByPriority.sort((a, b) => a.priority - b.priority)
    const firstVisible = popupDataByPriority.findIndex((item) => item.popupData.visible)

    let activePopup = null
    if (firstVisible >= 0 && popupDataByPriority[firstVisible]) {
      activePopup = popupDataByPriority[firstVisible].popupName
    }
    return activePopup
  }

  const initialPopupData = {
    votePopup: {
      visible: dataManager.get('showFeedbackForm'),
      priority: 1
    },
    reviewPopup: {
      visible: false,
      priority: 2
    },
    dataCollectionPopup: {
      visible: dataManager.get('showDataCollectionPopup'),
      priority: 3
    },
    premiumPromoPopup: {
      visible: dataManager.get('showPremiumPromoPopup'),
      priority: 4
    }
  }

  storage.state('popups').onChange((popupData) => {
    const activePopup = getActivePopup(popupData)
    const oldActivePopup = storage.state('activePopup').get()
    if (activePopup !== oldActivePopup) {
      // Set initial active popup
      storage.state('activePopup').set(activePopup)
    }
  })

  // Set initial data from popups
  storage.state('popups').set(initialPopupData)

  storage.on('showPopup', (popupName) => {
    const popupState = storage.state('popups').get()

    if (popupName && popupState[popupName]) {
      popupState[popupName].visible = true
    }

    storage.state('popups').set(popupState)
  })

  storage.on('hidePopup', (popupName) => {
    const popupState = storage.state('popups').get()

    if (popupName && popupState[popupName]) {
      popupState[popupName].visible = false
    }

    storage.state('popups').set(popupState)
  })

  storage.on('hideAll', () => {
    const popupState = storage.state('popups').get()

    Object.keys(popupState).forEach((popupName) => {
      popupState[popupName].visible = false
    })

    storage.state('popups').set(popupState)
  })

  // Full page popup actions
  storage.on('showFullPagePopup', () => {
    storage.state('activeFullPopup').set(true)
  })

  storage.on('hideFullPagePopup', () => {
    storage.state('activeFullPopup').set(false)
  })
})
