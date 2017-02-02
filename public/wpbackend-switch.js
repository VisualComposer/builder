import vcCake from 'vc-cake'
import './sources/less/bootstrap/init.less'
import './sources/css/wordpress.less'
import './sources/less/wpbackend/layout/init.less'
import './config/variables'
// import './config/wpbackend-switcher-attributes'
import './config/wpbackend-switcher-services'

import jQuery from 'jquery'

jQuery(() => {
  vcCake.start(() => {
    require('./config/wpbackend-switcher-modules')
  })
})
