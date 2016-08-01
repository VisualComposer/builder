import vcCake from 'vc-cake'
import SettingsButtonControl from './lib/navbar-control'

vcCake.add('ui-layout-control', (api) => {
  api.module('ui-navbar').do('addElement', 'Settings', SettingsButtonControl)
})
