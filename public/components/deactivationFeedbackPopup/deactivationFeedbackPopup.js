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
  const couldntGetThePluginToWork = localizations ? localizations.couldntGetThePluginToWork : 'I couldn\'t get the plugin to work'
  const itsATemporaryDeactivation = localizations ? localizations.itsATemporaryDeactivation : 'It\'s a temporary deactivation'
  const other = localizations ? localizations.other : 'Other'
  const pleaseShareTheReason = localizations ? localizations.pleaseShareTheReason : 'Please share the reason'
  const submitAndDeactivate = localizations ? localizations.submitAndDeactivate : 'Submit &amp; Deactivate'
  const skipAndDeactivate = localizations ? localizations.skipAndDeactivate : 'Skip &amp; Deactivate'
  const $ = window.jQuery

  const deactivationReasons = {
    'no-longer-need': {
      title: `${noLongerNeed}`,
      placeholder: ''
    },
    'found-a-better-plugin': {
      title: `${foundABetterPlugin}`,
      placeholder: `${pleaseShareWhichPlugin}`
    },
    'couldnt-get-the-plugin-to-work': {
      title: `${couldntGetThePluginToWork}`,
      placeholder: ''
    },
    'temporary-deactivation': {
      title: `${itsATemporaryDeactivation}`,
      placeholder: ''
    },
    'other-reason': {
      title: `${other}`,
      placeholder: `${pleaseShareTheReason}`
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
           <input class="vcv-deactivate-popup-form-input" value="${deactivationReasons[reason].title}" type="radio" name="vcv-deactivation-reason" id="${reason}">
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

    const closeButton = visualComposerSection.querySelector('.vcv-deactivate-popup-close-button')
    closeButton.addEventListener('click', (e) => {
      e.preventDefault()
      popupHTML.style.display = 'none'
    })

    const submitButton = visualComposerSection.querySelector('.vcv-deactivate-popup-button-submit')
    submitButton.addEventListener('click', handleSubmit)

    function pluginDeactivation () {
      const deactivationLink = document.querySelector('#vcv-visual-composer-website-builder a.vcv-deactivation-submit-button').href
      popupHTML.style.display = 'none'
      window.location.href = deactivationLink
    }

    function handleSubmit (e) {
      e.preventDefault()
      const reason = visualComposerSection.querySelectorAll('input:checked')[0].value
      const extraFeedback = visualComposerSection.querySelector('input:checked').parentElement.querySelector('.vcv-deactivate-popup-form-secondary-input')
      let extraFeedbackValue = ''
      if (extraFeedback) {
        extraFeedbackValue = extraFeedback.value
      }

      $.ajax(window.vcvAdminAjaxUrl,
        {
          dataType: 'json',
          data: {
            'vcv-action': 'license:deactivation:submit:adminNonce',
            'vcv-reason': `${reason}`,
            'vcv-extra-feedback': extraFeedbackValue,
            'vcv-nonce': window.vcvNonce
          }
        }).done(() => { pluginDeactivation() })
    }

    const skipAndSubmitButton = visualComposerSection.querySelector('.vcv-deactivate-popup-button-skip')
    skipAndSubmitButton.addEventListener('click', (e) => {
      e.preventDefault()
      pluginDeactivation()
    })
  }

  visualComposerDeactivateButton.addEventListener('click', handleDeactivateClick)
}
