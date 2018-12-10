import './sources/less/wpsettings-update/init.less'
import { hoverTooltip } from './components/wpVcSettings/helpTooltips'
import { checkStatus } from './components/wpVcSettings/statusCheck'
import { initEditors } from './components/wpVcSettings/editors'

(($) => {
  checkStatus()
  hoverTooltip()
  initEditors()
})(window.jQuery)
