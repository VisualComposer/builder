import './sources/less/wpbackend-switcher/init.less'
import './variables'
import start from './components/backendSwitcher/index'

(($) => {
  // jQuery.ready
  $(() => {
    start()
  })
})(window.jQuery)
