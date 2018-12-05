import './sources/less/wpsettings-update/init.less'
import { hoverTooltip } from './resources/wpVcSettings/helpTooltips'
import { checkStatus } from './resources/wpVcSettings/statusCheck'

(($) => {
  checkStatus()
  hoverTooltip()

  /**
   * Initialise CSS code editor
   * See more @/Modules/Settings/Fields/CssEditor.php
   */
  document.querySelectorAll('.vcv-css-code-editor').forEach(function (item) {
    window.wp.codeEditor.initialize(item, { codemirror: window.jQuery.extend({}, window.wp.codeEditor.defaultSettings.codemirror, { mode: 'text/css' }) })
  })

  /**
   * Initialise JS code editor
   * See more @/Modules/Settings/Fields/JsEditor.php
   */
  document.querySelectorAll('.vcv-js-code-editor').forEach(function (item) {
    window.wp.codeEditor.initialize(item)
  })
})(window.jQuery)
