import './sources/less/wpsettings-update/init.less'
import { hoverTooltip } from './resources/wpVcSettings/helpTooltips'
import { checkStatus } from './resources/wpVcSettings/statusCheck'
import { initEditors } from './resources/wpVcSettings/editors'

(($) => {
  checkStatus()
  hoverTooltip()
  initEditors()
})(window.jQuery)
