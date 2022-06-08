import vcCake from 'vc-cake'
import ReactDOM from 'react-dom'
import React from 'react'

import 'public/variables'
import 'public/config/hub-services'

import 'public/components/polyfills/index'
import 'public/sources/less/bootstrap/init.less'
import 'public/sources/css/wordpress.less'

import HubContainer from './components/panels/hub/hubContainer'
import FullPopup from 'public/components/popup/fullPagePopupContainer'

import { Provider } from 'react-redux'
import store from 'public/editor/stores/store'

const dataManager = vcCake.getService('dataManager')

export const setupCake = () => {
  const globalStoreInstance = require('public/editor/stores/globalStoreInstance')
  vcCake.env('globalStore', globalStoreInstance)
  vcCake.env('platform', 'wordpress').start(() => {
    vcCake.env('editor', 'frontend')
    // require('./editor/stores/fieldOptionsStorage')
    // require('./editor/stores/events/eventsStorage')
    // require('./editor/stores/elements/elementsStorage')
    // require('./editor/stores/assets/assetsStorage')
    // require('./editor/stores/shortcodesAssets/storage')
    // require('./editor/stores/cacheStorage')
    // require('./editor/stores/migrationStorage')
    require('./editor/stores/workspaceStorage')
    require('./editor/stores/hub/hubElementsStorage')
    require('./editor/stores/hub/hubTemplatesStorage')
    require('./editor/stores/hub/hubAddonsStorage')
    // require('./editor/stores/sharedAssets/storage')
    // require('./editor/stores/history/historyStorage')
    require('./editor/stores/settingsStorage')
    // require('./editor/stores/attributes/attributesStorage')
    // require('./editor/stores/wordpressData/wordpressDataStorage')
    require('./editor/stores/elements/elementSettings')
    const hubElementsStorage = vcCake.getStorage('hubElements')
    hubElementsStorage.trigger('start')
    const hubTemplatesStorage = vcCake.getStorage('hubTemplates')
    hubTemplatesStorage.trigger('start')
    const hubAddonsStorage = vcCake.getStorage('hubAddons')
    hubAddonsStorage.trigger('start')
    const settingsStorage = vcCake.getStorage('settings')
    settingsStorage.trigger('start')

    if (dataManager.get('hubGetTemplates')) {
      hubTemplatesStorage.state('templates').set(dataManager.get('hubGetTemplates'))
    }

    // const sharedAssetsStorage = vcCake.getStorage('sharedAssets')
    // sharedAssetsStorage.trigger('start')
    // const settingsStorage = vcCake.getStorage('settings')
    // settingsStorage.trigger('start')
    // const attributesStorage = vcCake.getStorage('attributes')
    // attributesStorage.trigger('start')
    const workspaceStorage = vcCake.getStorage('workspace')
    workspaceStorage.state('isHubInWpDashboard').set(true)

    const hideScrollbar = true
    const addNotifications = true
    window.setTimeout(() => {
      ReactDOM.render(
        <Provider store={store}>
          <HubContainer parent={{}} hideScrollbar={hideScrollbar} addNotifications={addNotifications} visible namespace='vcdashboard' />
        </Provider>,
        document.querySelector('#vcv-hub')
      )

      const popupWrapper = document.createElement('div')
      document.body.appendChild(popupWrapper)

      ReactDOM.render(
        <Provider store={store}>
          <FullPopup />
        </Provider>,
        popupWrapper
      )
    })
  })
}

setupCake()

if (vcCake.env('VCV_DEBUG') === true) {
  window.app = vcCake
}
