import vcCake from 'vc-cake'
import TreeView from './lib/treeViewLayout'
import TreeViewNavbarControl from './lib/navbarControl'

vcCake.add('ui-tree-view', (api) => {
  api.module('ui-layout-bar').do('setStartContent', TreeView, {
    api: api
  })

  api.module('ui-navbar').do('addElement', 'Tree layout', TreeViewNavbarControl, { pin: 'visible', api: api })
})
