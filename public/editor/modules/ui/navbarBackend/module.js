import vcCake from 'vc-cake'
import Navbar from './lib/navbar'

vcCake.add('ui-navbar', (api) => {
  api.module('ui-layout-bar').do('setHeaderContent', Navbar, {
    api: api
  })
})
