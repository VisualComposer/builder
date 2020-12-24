import './sources/less/wpsettings-update/init.less'
import 'public/editor/services/dataManager/service'
import { hoverTooltip } from './components/wpVcSettings/helpTooltips'
import { checkStatus } from './components/wpVcSettings/statusCheck'
import { initEditors } from './components/wpVcSettings/editors'
import { hfSectionToggle } from './components/wpVcSettings/hfSectionToggle'
import { dropdownEditLink } from './components/wpVcSettings/dropdownEditLink'
import { themeTemplatesToggle } from './components/wpVcSettings/themeTemplatesToggle'
import { deactivationFeedbackPopup } from './components/deactivationFeedbackPopup/deactivationFeedbackPopup'
import { dashboard } from './components/wpVcSettings/dashboard'

(() => {
  // TODO: Refactor this, and call this methods only on required pages
  const settingsPages = ['vcv-settings', 'vcv-headers-footers', 'vcv-custom-page-templates', 'vcv-maintenance-mode', 'vcv-custom-site-popups', 'vcv-system-status', 'vcv-license']
  const currentUrl = new URL(document.url)
  const paths = currentUrl.pathname.split('/')
  const urlParams = new URLSearchParams(window.location.search)
  const current = urlParams.get('page')

  if (current === 'vcv-global-css-js') {
    initEditors()
  }
  if (settingsPages.includes(current)) {
    hoverTooltip()
    checkStatus()
    hfSectionToggle()
    dropdownEditLink()
    themeTemplatesToggle()
    dashboard()
  }
  if (paths.includes('plugins.php')) {
    deactivationFeedbackPopup()
  }
})(window.jQuery)
