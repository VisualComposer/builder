import vcCake from 'vc-cake'
import BrandLogoControl from './lib/control'
import '../../../../sources/less/ui/brand-logo/init.less'

vcCake.add('ui-brand-logo', (api) => {
  api.module('ui-navbar').do('addElement', 'Get link', BrandLogoControl, { pin: 'visible' })
})
