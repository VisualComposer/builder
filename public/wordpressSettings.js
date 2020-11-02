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
  checkStatus()
  hoverTooltip()
  initEditors()
  hfSectionToggle()
  dropdownEditLink()
  themeTemplatesToggle()
  deactivationFeedbackPopup()
  dashboard()
})(window.jQuery)
