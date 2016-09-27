import vcCake from 'vc-cake'
import Settings from './lib/settings'
import SettingsButtonControl from './lib/navbarControl'

import './css/init.less'

vcCake.add('ui-settings', (api) => {
  // subscribe to global events
  api
    .reply('app:settings', (show) => {
      api.notify('show', show)
    })

  // subscribe to local events
  api
    .on('hide', () => {
      api.module('ui-layout-bar').do('setEndContent', null)
      api.module('ui-layout-bar').do('setEndContentVisible', false)
    })
    .on('show', () => {
      api.module('ui-layout-bar').do('setEndContent', Settings, {
        api: api
      })
      api.module('ui-layout-bar').do('setEndContentVisible', true)
    })

  api.module('ui-navbar').do('addElement', 'Settings', SettingsButtonControl, { pin: 'visible', api: api })
})
