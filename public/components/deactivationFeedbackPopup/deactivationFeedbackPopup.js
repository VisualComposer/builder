import './init.less'
import { getService } from 'vc-cake'

const pluginsPageContainer = document.querySelector('.wp-list-table.plugins')

export const deactivationFeedbackPopup = () => {
  if (!pluginsPageContainer) {
    return
  }
  const visualComposerSection = document.querySelector('[data-slug="visualcomposer"]')
  const visualComposerDeactivateButton = visualComposerSection.querySelector('.deactivate a')
  const localizations = window.VCV_I18N && window.VCV_I18N()
  const quickFeedback = localizations ? localizations.quickFeedback : 'QUICK FEEDBACK'
  const pleaseShareWhy = localizations ? localizations.pleaseShareWhy : 'If you have a moment, please share why you are deactivating Visual Composer:'
  const noLongerNeed = localizations ? localizations.noLongerNeed : 'I no longer need the plugin'
  const foundABetterPlugin = localizations ? localizations.foundABetterPlugin : 'I found a better plugin'
  const pleaseShareWhichPlugin = localizations ? localizations.pleaseShareWhichPlugin : 'Please share which plugin'
  const couldntGetThePluginToWork = localizations ? localizations.couldntGetThePluginToWork : 'I couldn\'t get the plugin to work'
  const itsATemporaryDeactivation = localizations ? localizations.itsATemporaryDeactivation : 'It\'s a temporary deactivation'
  const other = localizations ? localizations.other : 'Other'
  const pleaseShareTheReason = localizations ? localizations.pleaseShareTheReason : 'Please share the reason'
  const submitAndDeactivate = localizations ? localizations.submitAndDeactivate : 'Submit &amp; Deactivate'
  const skipAndDeactivate = localizations ? localizations.skipAndDeactivate : 'Skip &amp; Deactivate'
  let closeButton = null
  let submitButton = null
  let skipAndSubmitButton = null

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
      defaultTitle: 'I couldn\'t get the plugin to work',
      placeholder: ''
    },
    'temporary-deactivation': {
      title: itsATemporaryDeactivation,
      defaultTitle: 'It\'s a temporary deactivation',
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
                <img src="https://cdn.hub.visualcomposer.com/plugin-assets/vcwb-logo.svg" alt="Visual Composer">
                <span class="vcv-deactivate-popup-title">${quickFeedback}</span>
            </div>
            <button class="vcv-deactivate-popup-close-button vcv-ui-icon vcv-ui-icon-close-thin"></button>
        </div>
        <div class="vcv-deactivate-popup-form-wrapper">
            <div class="vcv-deactivate-popup-form-title">${pleaseShareWhy}</div>
            <div class="vcv-deactivate-popup-form-reasons-wrapper">
                ${deactivationReasonsHTML}
            </div>
            <div class="vcv-deactivate-popup-button-wrapper">
                <button class="vcv-deactivate-popup-button-submit">${submitAndDeactivate}</button>
                <button class="vcv-deactivate-popup-button-skip">${skipAndDeactivate}</button>
            </div>
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

    popupElement.addEventListener('click', handlePopupClick)

    closeButton = popupElement.querySelector('.vcv-deactivate-popup-close-button')
    closeButton.addEventListener('click', handleCloseButtonClick)

    submitButton = popupElement.querySelector('.vcv-deactivate-popup-button-submit')
    submitButton.addEventListener('click', handleSubmit)

    skipAndSubmitButton = popupElement.querySelector('.vcv-deactivate-popup-button-skip')
    skipAndSubmitButton.addEventListener('click', handlePluginDeactivation)
  }

  const handlePopupClick = (e) => {
    if (e.target === popupElement) {
      closePopup()
    }
  }

  const handleCloseButtonClick = (e) => {
    e.preventDefault()
    closePopup()
  }

  const closePopup = () => {
    popupElement.style.display = 'none'
    closeButton.removeEventListener('click', handleCloseButtonClick)
    popupElement.removeEventListener('click', handlePopupClick)
    submitButton.removeEventListener('click', handleSubmit)
    skipAndSubmitButton.removeEventListener('click', handlePluginDeactivation)
  }

  const handlePluginDeactivation = (e) => {
    e && e.preventDefault && e.preventDefault()
    window.location.href = visualComposerDeactivateButton.href
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const checkedInput = popupElement.querySelector('input:checked')
    if (!checkedInput) {
      return
    }
    popupElement.querySelector('.vcv-deactivate-popup-button-submit').disabled = true
    popupElement.querySelector('.vcv-deactivate-popup-button-submit').classList.add('vcv-deactivate-popup-button-submit-loading')
    const reason = checkedInput.value
    const extraFeedback = checkedInput.parentElement.querySelector('.vcv-deactivate-popup-form-secondary-input')
    let extraFeedbackValue = ''
    if (extraFeedback) {
      extraFeedbackValue = extraFeedback.value
    }

    const dataProcessor = getService('dataProcessor')
    dataProcessor.appAdminServerRequest({
      'vcv-action': 'license:deactivation:submit:adminNonce',
      'vcv-reason': reason,
      'vcv-extra-feedback': extraFeedbackValue,
      'vcv-nonce': window.vcvNonce
    }).then(() => {
      handlePluginDeactivation()
    }, () => {
      handlePluginDeactivation()
    })
  }

  if (visualComposerDeactivateButton) {
    visualComposerDeactivateButton.addEventListener('click', handleDeactivateClick)
  }
}
