import vcCake from 'vc-cake'
import SeparatorControl from './lib/separator-control'

vcCake.add('ui-navbar-separator', (api) => {
  api.module('ui-navbar').do('addElement', 'Separator', SeparatorControl, { pin: 'visible' })
})
