import './sources/less/wpsettings-update/init.less'
import 'public/editor/services/dataManager/service'
import 'public/editor/services/utils/service'
import 'public/editor/services/dataProcessor/service'
import { hoverTooltip } from './components/wpVcSettings/helpTooltips'
import { checkStatus } from './components/wpVcSettings/statusCheck'
import { initEditors } from './components/wpVcSettings/editors'
import { hfSectionToggle } from './components/wpVcSettings/hfSectionToggle'
import { dropdownEditLink } from './components/wpVcSettings/dropdownEditLink'
import { themeTemplatesToggle } from './components/wpVcSettings/themeTemplatesToggle'
import { deactivationFeedbackPopup } from './components/deactivationFeedbackPopup/deactivationFeedbackPopup'
import { dashboard } from './components/wpVcSettings/dashboard'
import { downloadAddon } from './components/wpVcSettings/downloadAddon'

(($) => {
  $(() => {
    // only when ready
    const urlParams = new URLSearchParams(window.location.search)
    const current = urlParams.get('page')
    const currentUrl = new URL(document.URL)
    const paths = currentUrl.pathname.split('/')
    importJS(current)

    if (paths.includes('plugins.php')) {
      deactivationFeedbackPopup()
    }
    if (isSettingsPage(current)) {
      dashboard()
      downloadAddon()
    }
  })
})(window.jQuery)

function isSettingsPage (current) {
  return current.indexOf('vcv') === 0
}

export default function importJS (currentSection) {
  if (currentSection === 'vcv-global-css-js') {
    initEditors()
  } else if (currentSection === 'vcv-system-status') {
    checkStatus()
    hoverTooltip()
  } else if (currentSection === 'vcv-headers-footers') {
    hfSectionToggle()
    dropdownEditLink()
  } else if (currentSection === 'vcv-custom-page-templates') {
    dropdownEditLink()
    themeTemplatesToggle()
  } else if (currentSection === 'vcv-headers-footers' || currentSection === 'vcv-custom-site-popups' || currentSection === 'vcv-maintenance-mode') {
    dropdownEditLink()
  }
}
