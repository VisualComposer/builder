import vcCake from 'vc-cake'
import AddTemplateControl from './lib/navbar-control'

vcCake.add('ui-add-template', (api) => {
  api.module('ui-navbar').do('addElement', 'Add template', AddTemplateControl)
})
