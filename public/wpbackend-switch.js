import jQuery from 'jquery'
import { env, start } from 'vc-cake'
import './sources/less/wpbackend-switcher/init.less'
import './config/variables'

jQuery(() => {
  require('./config/wpbackend-switcher-modules')

  if (env('TF_DISABLE_BACKEND')) {
    start(() => {
    })
  }
})
