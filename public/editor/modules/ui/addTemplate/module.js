import vcCake from 'vc-cake'
import AddTemplateControl from './lib/navbarControl'

vcCake.add('ui-add-template', (api) => {
  api.module('ui-navbar').do('addElement', 'Add template', AddTemplateControl, { pin: 'visible' })
})
