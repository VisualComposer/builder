import './popup.less';

(function (window) {
  let popupTriggerElements = []

  const handleClosePopup = (e) => {
    const closeButton = e.currentTarget
    const popupContainer = closeButton.closest('.vcv-popup-container')
    popupContainer.classList.remove('vcv-popup-container--visible')
    const hidePopup = setTimeout(() => {
      popupContainer.setAttribute('hidden', true)
      popupContainer.setAttribute('aria-hidden', true)
      clearTimeout(hidePopup)
    }, 200)

    closeButton.removeEventListener('click', handleClosePopup)
  }

  const handleOpenPopup = (e) => {
    const id = e.currentTarget.href.split('#')[1]
    const popupContainer = document.getElementById(id)
    if (popupContainer) {
      const closeButton = popupContainer.querySelector('.vce-popup-root-close-button')

      popupContainer.removeAttribute('hidden')
      popupContainer.setAttribute('aria-hidden', false)

      const showPopup = setTimeout(() => {
        popupContainer.classList.add('vcv-popup-container--visible')
        clearTimeout(showPopup)
      }, 1)
      closeButton.addEventListener('click', handleClosePopup)
    } else {
      console.warn(`Popup with ID vcv-popup-${id} not found`)
    }
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


