import vcCake from 'vc-cake'
import {default as AddElement} from './lib/addElement'
import AddElementControl from './lib/navbarControl'

vcCake.add('uiAddElement', (api) => {
  // get get Parent
  let currentParentElement = null
  api.addAction('setParent', (parent) => {
    currentParentElement = parent
  })
  api.addAction('getParent', () => {
    return currentParentElement
  })
  // subscribe to global events
  api
    .reply('app:add', (parent = null, tag = null, options) => {
      !tag && api.notify('show', parent, options)
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
    .on('show', (parent = null, options = {}) => {
      api.actions.setParent(parent)
      api.module('ui-layout-bar').do('setEndContent', AddElement, {
        api: api,
        parent: parent,
        options: options
      })
      api.module('ui-layout-bar').do('setEndContentVisible', true, 'add-element')
    })

  api.module('ui-navbar').do('addElement', 'Add element', AddElementControl, { pin: 'visible', api: api })
})
