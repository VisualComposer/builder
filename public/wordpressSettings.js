import './sources/less/wpsettings-update/init.less'
import { hoverTooltip } from './components/wpVcSettings/helpTooltips'
import { checkStatus } from './components/wpVcSettings/statusCheck'
import { initEditors } from './components/wpVcSettings/editors'
import { hfSectionToggle } from './components/wpVcSettings/hfSectionToggle'
import { dropdownEditLink } from './components/wpVcSettings/dropdownEditLink'
import { themeTemplatesToggle } from './components/wpVcSettings/themeTemplatesToggle'
import { deactivationFeedbackPopup } from './components/deactivationFeedbackPopup/deactivationFeedbackPopup'

(() => {
  // TODO: Refactor this, and call this methods only on required pages
  checkStatus()
  hoverTooltip()
  initEditors()
  hfSectionToggle()
  dropdownEditLink()
  themeTemplatesToggle()
  deactivationFeedbackPopup()
})(window.jQuery)
