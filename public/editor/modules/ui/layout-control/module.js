import vcCake from 'vc-cake'
import LayoutNavbarControl from './lib/navbar-control'

vcCake.add('ui-layout-control', (api) => {
  api.module('ui-navbar').do('addElement', 'Layout control', LayoutNavbarControl, { pin: 'visible' })
})
