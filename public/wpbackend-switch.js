import { start } from 'vc-cake'
import './sources/less/wpbackend-switcher/init.less'
import './config/variables'

(($) => {
  // jQuery.ready
  $(() => {
    require('./config/wpbackend-switcher-modules')
    start(() => {
      // Required to bootstrap the switcher
    })
  })
})(window.jQuery)
