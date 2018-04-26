import jQuery from 'jquery'
import { start } from 'vc-cake'
import './sources/less/wpbackend-switcher/init.less'
import './config/variables'

jQuery(() => {
  require('./config/wpbackend-switcher-modules')

  start(() => {
    // Required to bootstrap the switcher
  })
})
