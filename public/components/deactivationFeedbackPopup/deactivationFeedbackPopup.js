import './init.less'

export const deactivationFeedbackPopup = () => {
  const visualComposerSection = document.querySelector('[data-slug="visualcomposer"]')
  const visualComposerDeactivateButton = visualComposerSection.querySelector('.deactivate a')
  const localizations = window.VCV_I18N && window.VCV_I18N()
  const quickFeedback = localizations ? localizations.quickFeedback : 'Quick Feedback'
  const pleaseShareWhy = localizations ? localizations.pleaseShareWhy : 'If you have a moment, please share why you are deactivating Visual Composer:'
  const noLongerNeed = localizations ? localizations.noLongerNeed : 'I no longer need the plugin'
  const foundABetterPlugin = localizations ? localizations.foundABetterPlugin : 'I found a better plugin'
  const pleaseShareWhichPlugin = localizations ? localizations.pleaseShareWhichPlugin : 'Please share which plugin'
  const couldntGetThePluginToWork = localizations ? localizations.couldntGetThePluginToWork : "I couldn't get the plugin to work"
  const itsATemporaryDeactivation = localizations ? localizations.itsATemporaryDeactivation : "It's a temporary deactivation"
  const other = localizations ? localizations.other : 'Other'
  const pleaseShareTheReason = localizations ? localizations.pleaseShareTheReason : 'Please share the reason'
  const submitAndDeactivate = localizations ? localizations.submitAndDeactivate : 'Submit &amp; Deactivate'
  const skipAndDeactivate = localizations ? localizations.skipAndDeactivate : 'Skip &amp; Deactivate'
  const $ = window.jQuery

  const deactivationReasons = {
    'no-longer-need': {
      title: noLongerNeed,
      defaultTitle: 'I no longer need the plugin',
      placeholder: ''
    },
    'found-a-better-plugin': {
      title: foundABetterPlugin,
      defaultTitle: 'I found a better plugin',
      placeholder: pleaseShareWhichPlugin
    },
    'couldnt-get-the-plugin-to-work': {
      title: couldntGetThePluginToWork,
      defaultTitle: "I couldn't get the plugin to work",
      placeholder: ''
    },
    'temporary-deactivation': {
      title: itsATemporaryDeactivation,
      defaultTitle: "It's a temporary deactivation",
      placeholder: ''
    },
    'other-reason': {
      title: other,
      defaultTitle: 'Other',
      placeholder: pleaseShareTheReason
    }
  }

  const getDeactivationPopupHTML = (deactivationReasons) => {
    let deactivationReasonsHTML = ''
    Object.keys(deactivationReasons).forEach((reason) => {
      let placeholder = ''
      if (deactivationReasons[reason].placeholder) {
        placeholder = `<input class="vcv-deactivate-popup-form-secondary-input" name="vcv-deactivation-feedback" placeholder="${deactivationReasons[reason].placeholder}">`
      }
      deactivationReasonsHTML = deactivationReasonsHTML + `<div class="vcv-deactivate-popup-form-input-wrapper ${reason}">
           <input class="vcv-deactivate-popup-form-input" value="${deactivationReasons[reason].defaultTitle}" type="radio" name="vcv-deactivation-reason" id="${reason}">
           <label class="vcv-deactivate-popup-form-label" for="${reason}">${deactivationReasons[reason].title}</label>
           ${placeholder}
      </div>`
    })

    return `<div class="vcv-deactivate-popup-wrapper">
        <div class="vcv-deactivate-popup-title-wrapper">
            <div class="vcv-deactivate-popup-title-wrapper-inner">
                <img src="../../../visualcomposer/resources/images/logo/20x14.png" alt="">
                <span class="vcv-deactivate-popup-title">${quickFeedback}</span>
            </div>
            <i class="vcv-deactivate-popup-close-button vcv-ui-icon vcv-ui-icon-close-thin"></i>
        </div>
        <div class="vcv-deactivate-popup-form-wrapper">
            <form>
                <div class="vcv-deactivate-popup-form-title">${pleaseShareWhy}</div>
                <div class="vcv-deactivate-popup-form-reasons-wrapper">
                    ${deactivationReasonsHTML}
                </div>
                <div class="vcv-deactivate-popup-button-wrapper">
                    <button class="vcv-deactivate-popup-button-submit">${submitAndDeactivate}</button>
                    <button class="vcv-deactivate-popup-button-skip">${skipAndDeactivate}</button>
                </div>
            </form>
        </div>
    </div>`
  }

  const popupElement = document.createElement('div')
  popupElement.className = 'vcv-deactivate-popup-container'
  popupElement.innerHTML = getDeactivationPopupHTML(deactivationReasons)

  const handleDeactivateClick = (e) => {
    e.preventDefault()
    visualComposerSection.appendChild(popupElement)
    popupElement.style.display = 'flex'

    const handlePopupClose = () => {
      closePopup()
    }

    const handlePopupClick = (e) => {
      if (e.target === popupElement) {
        closePopup()
      }
    }

    const closePopup = () => {
      popupElement.style.display = 'none'
      closeButton.removeEventListener('click', handlePopupClose)
      popupElement.removeEventListener('click', handlePopupClick)
      submitButton.removeEventListener('click', handleSubmit)
      skipAndSubmitButton.removeEventListener('click', pluginDeactivation)
    }

    popupElement.addEventListener('click', handlePopupClick)

    const closeButton = popupElement.querySelector('.vcv-deactivate-popup-close-button')
    closeButton.addEventListener('click', handlePopupClose)

    const submitButton = popupElement.querySelector('.vcv-deactivate-popup-button-submit')
    submitButton.addEventListener('click', handleSubmit)

    const skipAndSubmitButton = popupElement.querySelector('.vcv-deactivate-popup-button-skip')
    skipAndSubmitButton.addEventListener('click', pluginDeactivation)
  }

  const pluginDeactivation = () => {
    const deactivationLink = visualComposerDeactivateButton.href
    window.location.href = deactivationLink
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const reason = popupElement.querySelector('input:checked').value
    const extraFeedback = popupElement.querySelector('input:checked').parentElement.querySelector('.vcv-deactivate-popup-form-secondary-input')
    let extraFeedbackValue = ''
    if (extraFeedback) {
      extraFeedbackValue = extraFeedback.value
    }

    $.ajax(window.vcvAdminAjaxUrl,
      {
        dataType: 'json',
        data: {
          'vcv-action': 'license:deactivation:submit:adminNonce',
          'vcv-reason': reason,
          'vcv-extra-feedback': extraFeedbackValue,
          'vcv-nonce': window.vcvNonce
        }
      }).done(pluginDeactivation)
  }

  if (visualComposerDeactivateButton) {
    visualComposerDeactivateButton.addEventListener('click', handleDeactivateClick)
  }
}
