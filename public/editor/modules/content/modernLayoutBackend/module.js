import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import Layout from './lib/layout'
import DndManager from './lib/dnd/dndManager'
import WipControlsManager from './lib/controls/wipControlsManager'

if (vcCake.env('FEATURE_WPBACKEND')) {
  vcCake.add('contentModernLayoutBackend', (api) => {
    const domContainer = document.getElementById('vcv-wpbackend-layout-content')
    ReactDOM.render(
      <Layout api={api} />,
      domContainer
    )
    let dnd = new DndManager(api)
    dnd.init()
    let controls = new WipControlsManager(api)
    let options = {
      iframeContainer: document.querySelector('.vcv-wpbackend-layout-content-container'),
      iframeOverlay: document.querySelector('#vcv-wpbackend-layout-content-overlay'),
      iframe: document.querySelector('#vcv-wpbackend-layout-content'),
      iframeWindow: document.defaultView,
      iframeDocument: document
    }
    controls.init(options)
  })
}
