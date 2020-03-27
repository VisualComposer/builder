import './init.less'

export const deactivationFeedbackPopup = () => {
  const visualComposerSection = document.querySelector('[data-slug="visualcomposer"]')
  const visualComposerDeactivateButton = visualComposerSection.querySelector('.deactivate a')

  const deactivationReasons = {
    'no-longer-need': {
      title: 'I no longer need the plugin',
      placeholder: ''
    },
    'found-a-better-plugin': {
      title: 'I found a better plugin',
      placeholder: 'Please share which plugin'
    },
    'couldnt-get-the-plugin-to-work': {
      title: 'I couldn\'t get the plugin to work',
      placeholder: ''
    },
    'temporary-deactivation': {
      title: 'It\'s a temporary deactivation',
      placeholder: ''
    },
    'other-reason': {
      title: 'Other',
      placeholder: 'Please share the reason'
    }
  }

  const getDeactivationPopupHTML = (deactivationReasons) => {
    let deactivationReasonsHTML = ''
    Object.keys(deactivationReasons).forEach((reason) => {
      let placeholder = ''
      if (deactivationReasons[reason].placeholder) {
        placeholder = `<input class="vcv-deactivate-popup-form-secondary-input" placeholder="${deactivationReasons[reason].placeholder}">`
      }
      deactivationReasonsHTML = deactivationReasonsHTML + `<div class="vcv-deactivate-popup-form-input-wrapper ${reason}">
           <input class="vcv-deactivate-popup-form-input" type="radio" name="reason_key" id="${reason}">
           <label class="vcv-deactivate-popup-form-label" for="${reason}">${deactivationReasons[reason].title}</label>
           ${placeholder}
      </div>`
    })

    return '<div class="vcv-deactivate-popup-wrapper">' +
      '<div class="vcv-deactivate-popup-title-wrapper">' +
      '<img src="../../../visualcomposer/resources/images/logo/20x14.png" alt="">' +
      '<span class="vcv-deactivate-popup-title">Quick Feedback</span>' +
      '</div>' +
      '<div class="vcv-deactivate-popup-form-wrapper">' +
      '<form>' +
      '<div class="vcv-deactivate-popup-form-title">If you have a moment, please share why you are deactivating Visual Composer:</div>' +
      '<div class="vcv-deactivate-popup-form-reasons-wrapper">' +
      `${deactivationReasonsHTML}` +
      '</div>' +
      '<div class="vcv-deactivate-popup-buttons-wrapper">' +
      '<button class="vcv-deactivate-popup-buttons-submit">Submit &amp; Deactivate</button>' +
      '<button class="vcv-deactivate-popup-buttons-skip">Skip &amp; Deactivate</button>' +
      '</div>' +
      '</form>' +
      '</div>' +
      '</div>'
  }

  const popupHTML = document.createElement('div')
  popupHTML.className = 'vcv-deactivate-popup-container'
  popupHTML.innerHTML = getDeactivationPopupHTML(deactivationReasons)

  function handleDeactivateClick (e) {
    e.preventDefault()
    visualComposerSection.appendChild(popupHTML)
    popupHTML.style.display = 'flex'

    popupHTML.addEventListener('click', (e) => {
      if (e.target === popupHTML) {
        popupHTML.style.display = 'none'
      }
    })
  }

  visualComposerDeactivateButton.addEventListener('click', handleDeactivateClick)
}
