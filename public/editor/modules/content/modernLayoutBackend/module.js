import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import Layout from './lib/layout'
import DndManager from './lib/dnd/dndManager'
import ControlsManager from './lib/controls/controlsManager'
import MobileDetect from 'mobile-detect'

vcCake.add('contentModernLayoutBackend', (api) => {
  const domContainer = document.getElementById('vcv-wpbackend-layout-content')
  ReactDOM.render(
    <Layout api={api} />,
    domContainer
  )
  let dnd = new DndManager(api)
  dnd.init()
  if (vcCake.env('MOBILE_DETECT')) {
    const mobileDetect = new MobileDetect(window.navigator.userAgent)
    if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
      return
    }
  }
  let controls = new ControlsManager(api)
  let options = {
    iframeContainer: document.querySelector('.vcv-wpbackend-layout-content-container'),
    iframeOverlay: document.querySelector('#vcv-wpbackend-layout-content-overlay'),
    iframe: document.querySelector('#vcv-wpbackend-layout-content'),
    iframeWindow: document.defaultView,
    iframeDocument: document
  }
  controls.init(options)
})
