import vcCake from 'vc-cake'
import BrandLogoControl from './lib/control'

vcCake.add('ui-brand-logo-backend', (api) => {
  api.module('ui-navbar').do('addElement', 'Get link', BrandLogoControl, { pin: 'visible' })
})
