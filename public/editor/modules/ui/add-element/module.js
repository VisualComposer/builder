/*eslint jsx-quotes: [2, "prefer-double"]*/
import vcCake from 'vc-cake'
import {default as AddElement} from './lib/add-element'
require('./lib/navbar-control')
require('./css/init.less')

vcCake.add('ui-add-element', (api) => {
  // get get Parrent
  let currentParentElement = false
  api.addAction('setParent', (parent) => {
    currentParentElement = parent
  })
  api.addAction('getParent', () => {
    return currentParentElement
  })
  // add actions to api:add event
  api.reply('app:add', (parent = null) => {
    api.notify('show', parent)
  }).on('hide', () => {
    api.module('ui-layout-bar').do('setEndContent', null)
    api.request('tree-view:hide')
  }).on('show', (parent = null) => {
    api.module('ui-layout-bar').do('setEndContent', AddElement, {
      api: api,
      parent: parent
    })
  })
})
