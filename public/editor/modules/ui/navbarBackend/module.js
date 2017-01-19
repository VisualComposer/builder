import vcCake from 'vc-cake'
import NavbarContainer from './lib/navbar-container'

vcCake.add('ui-navbar', (api) => {
  api.module('ui-layout-bar').do('setHeaderContent', NavbarContainer, {
    api: api
  })
})
