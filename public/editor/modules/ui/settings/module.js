import vcCake from 'vc-cake'
// import Settings from './lib/settings'
import SettingsButtonControl from './lib/navbarControl'

vcCake.add('ui-settings', (api) => {
  // // get Parent
  // let currentParentElement = null
  // api.addAction('setParent', (parent) => {
  //   currentParentElement = parent
  // })
  // api.addAction('getParent', () => {
  //   return currentParentElement
  // })
  // // subscribe to global events
  // api
  //   .reply('app:add', (parent = null, tag = null) => {
  //     !tag && api.notify('show', parent)
  //   })
  //   .reply('data:add', () => {
  //     api.notify('hide')
  //   })
  //   .reply('data:remove', (id) => {
  //     if (id === api.actions.getParent()) {
  //       api.notify('hide')
  //     }
  //   })
  //
  // // subscribe to local events
  // api
  //   .on('hide', () => {
  //     api.actions.setParent(null)
  //     api.module('ui-layout-bar').do('setEndContent', null)
  //     api.module('ui-layout-bar').do('setEndContentVisible', false)
  //   })
  //   .on('show', (parent = null) => {
  //     api.actions.setParent(parent)
  //     api.module('ui-layout-bar').do('setEndContent', Settings, {
  //       api: api,
  //       parent: parent
  //     })
  //     api.module('ui-layout-bar').do('setEndContentVisible', true)
  //   })

  api.module('ui-navbar').do('addElement', 'Settings', SettingsButtonControl, { pin: 'visible', api: api })
})
