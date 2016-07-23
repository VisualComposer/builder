import vcCake from 'vc-cake'
import Control from './lib/navbar-save-button'
require('../../../../sources/less/ui/loader/init.less')

vcCake.add('ui-node-save', (api) => {
  api.module('ui-navbar').do('addElement', 'Save post', Control, { pin: 'visible' })
})
