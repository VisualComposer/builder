import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import Layout from './lib/layout'
import DndManager from './lib/dnd/dndManager'
import ControlsManager from './lib/controls/controlsManager'
import MobileControlsManager from './lib/controls/mobileControlsManager'
import MobileDetect from 'mobile-detect'
import Notifications from './lib/notifications'

const workspaceStorage = vcCake.getStorage('workspace')
const workspaceNotifications = workspaceStorage.state('notifications')

vcCake.add('contentModernLayoutBackend', (api) => {
  const domContainer = document.getElementById('vcv-wpbackend-layout-content')
  if (domContainer) {
    ReactDOM.render(
      <Layout api={api} />,
      domContainer
    )
    let dnd = new DndManager(api)
    dnd.init()
    let mobileDevice = false

    let notifications
    if (vcCake.env('UI_NOTIFICATIONS')) {
      workspaceStorage.state('layoutBarMount').onChange((data) => {
        if (data.layoutBarMounted) {
          notifications = new Notifications(document.querySelector('.vcv-layout-bar'), document.querySelector('.wrap'))
          notifications.init()

          if (mobileDevice) {
            const localizations = window.VCV_I18N && window.VCV_I18N()
            workspaceNotifications.set({
              position: 'bottom',
              transparent: true,
              rounded: true,
              text: localizations.mobileTooltipText || 'Double click on the element to open the edit window. Hold finger to initiate drag and drop in a Tree view.',
              cookie: 'vcv-mobile-tooltip',
              time: 10000
            })
          }
        }
      })
    }

    let options = {
      iframeContainer: document.querySelector('.vcv-wpbackend-layout-content-container'),
      iframeOverlay: document.querySelector('#vcv-wpbackend-layout-content-overlay'),
      iframe: document.querySelector('#vcv-wpbackend-layout-content'),
      iframeWindow: document.defaultView,
      iframeDocument: document,
      isBackend: true
    }

    if (vcCake.env('MOBILE_DETECT')) {
      const mobileDetect = new MobileDetect(window.navigator.userAgent)
      if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
        let mobileControls = new MobileControlsManager(api)
        mobileControls.init(options)
        mobileDevice = true
        return
      }
    }
    let controls = new ControlsManager(api)
    controls.init(options)
  }
})
