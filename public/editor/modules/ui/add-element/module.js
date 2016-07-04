/*eslint jsx-quotes: [2, "prefer-double"]*/
import vcCake from 'vc-cake'
import {default as AddElement} from './lib/add-element'
require('./lib/navbar-control')
require('./css/init.less')

vcCake.add('ui-add-element', (api) => {
  // get get Parrent
  let currentParentElement = null
  api.addAction('setParent', (parent) => {
    currentParentElement = parent
  })
  api.addAction('getParent', () => {
    return currentParentElement
  })
  // subscribe to global events
  api
    .reply('app:add', (parent = null) => {
      api.notify('show', parent)
    })
    .reply('data:add', () => {
      api.notify('hide')
    })
    .reply('data:remove', (id) => {
      if (id === api.actions.getParent()) {
        api.notify('hide')
      }
    })

  // subscribe to local events
  api
    .on('hide', () => {
      api.actions.setParent(null)
      api.module('ui-layout-bar').do('setEndContent', null)
      api.module('ui-layout-bar').do('setEndContentVisible', false)
    })
    .on('show', (parent = null) => {
      api.actions.setParent(parent)
      api.module('ui-layout-bar').do('setEndContent', AddElement, {
        api: api,
        parent: parent
      })
      api.module('ui-layout-bar').do('setEndContentVisible', true)
    })
})
