/*eslint jsx-quotes: [2, "prefer-double"]*/
import vcCake from 'vc-cake'
import {default as AddElement} from './lib/add-element'
require('./lib/navbar-control')
require('./css/init.less')

vcCake.add('ui-add-element', (api) => {
  let currentParentElement = false
  api.addAction('setParent', (parent) => {
    currentParentElement = parent
  })
  api.addAction('getParent', () => {
    return currentParentElement
  })
  api.reply('app:add', (parent = null) => {
    api.notify('show', parent)
  }).on('hide', () => {
    api.module('ui-tree-layout').do('setContent', null)
    api.request('tree-layout:hide')
  }).on('show', (parent = null) => {
    api.module('ui-tree-layout').do('setContent', AddElement, {
      api: api,
      parent: parent
    })
    api.request('tree-layout:show-content')
  })
})
