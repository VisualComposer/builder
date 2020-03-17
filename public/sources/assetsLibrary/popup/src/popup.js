(function (window) {
  let popupTriggerElements = []

  const handleClosePopup = (e) => {
    const closeButton = e.currentTarget
    const popupContainer = closeButton.closest('vcv-popup-container')
    popupContainer.classList.remove('vcv-popup-container--visible')
    closeButton.removeEventListener('click', handleClosePopup)
  }

  const handleOpenPopup = (e) => {
    const id = e.currentTarget.href.split('#')[1]
    const popupContainer = document.getElementById(id)
    const closeButton = popupContainer.querySelector('.vce-popup-root-close-button')

    popupContainer.classList.add('vcv-popup-container--visible')
    closeButton.addEventListener('click', handleClosePopup)
  }

  window.vcv.on('ready', function (action, id) {
    if (action && id) {
      if (popupTriggerElements.length) {
        popupTriggerElements.forEach((el) => {
          el.removeEventListener('click', handleOpenPopup)
        })
      }
    }

    popupTriggerElements = [].slice.call(document.querySelectorAll('[href^="#vcv-popup-"]'))

    popupTriggerElements.forEach((item) => {
      item.addEventListener('click', handleOpenPopup)
    })
  })
}(window))


