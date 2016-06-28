import vcCake from 'vc-cake'
import {default as TreeView} from './lib/tree-view'
require('./lib/navbar-control')
vcCake.add('ui-tree-view', (api) => {
  api.module('ui-layout-bar').do('setStartContent', TreeView, {
    api: api
  })
})
