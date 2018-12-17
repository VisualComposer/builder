import './sources/less/wpbackend-switcher/init.less'
import './config/variables'
import { default as start } from './components/backendSwitcher/index'

(($) => {
  // jQuery.ready
  $(() => {
    start()
  })
})(window.jQuery)
