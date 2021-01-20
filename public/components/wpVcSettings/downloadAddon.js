import { getService } from 'vc-cake'
import { getResponse } from 'public/tools/response'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')
const utils = getService('utils')

export const downloadAddon = () => {
  const handleButtonClick = (event) => {
    const downloadButton = event.target
    const downloadButtonContainer = event.target.parentElement

    downloadButtonContainer.classList.add('vcv-dashboard-button--loading')
    downloadButton.setAttribute('disabled', true)

    const tag = downloadButton.getAttribute('data-vcv-action-bundle')
    const bundle = 'addon/' + tag.charAt(0).toLowerCase() + tag.substr(1, tag.length - 1)
    const data = {
      'vcv-action': 'hub:download:addon:adminNonce',
      'vcv-bundle': bundle,
      'vcv-nonce': dataManager.get('nonce')
    }

    let tries = 0
    const tryDownload = () => {
      const successCallback = (response) => {
        try {
          const jsonResponse = getResponse(response)
          if (jsonResponse && jsonResponse.status) {
            utils.buildVariables(jsonResponse.variables || [])
            window.location.reload()
          } else {
            tries++
            console.warn('failed to download addon status is false', jsonResponse, response)
            if (tries < 2) {
              tryDownload()
            } else {
              let errorMessage = localizations.licenseErrorAddonDownload || 'Failed to download addon (license expired or request timed out)'
              if (jsonResponse && jsonResponse.message) {
                errorMessage = jsonResponse.message
              }
              console.warn('failed to download addon status is false', errorMessage, response)
            }
          }
        } catch (e) {
          tries++
          console.warn('failed to parse download response', e, response)
          if (tries < 2) {
            tryDownload()
          }
        }
      }
      const errorCallback = (response) => {
        tries++
        console.warn('failed to download addon general server error', response)
        if (tries < 2) {
          tryDownload()
        }
      }
      utils.startDownload(tag, data, successCallback, errorCallback)
    }
    tryDownload()
  }

  const downloadAddonButtons = document.querySelectorAll('.vcv-premium-teaser-btn.vcv-premium-teaser-download-addon-btn')
  downloadAddonButtons.forEach((button) => {
    button.addEventListener('click', handleButtonClick)
  })
}
