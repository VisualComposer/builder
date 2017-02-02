import vcCake from 'vc-cake'
import ReactDOM from 'react-dom'
import React from 'react'
import Layout from './lib/layout'
import DndManager from './lib/dnd/dndManager'
import WipControlsManager from './lib/controls/wipControlsManager'

if (vcCake.env('FEATURE_WPBACKEND')) {
  vcCake.add('backendLayout', (api) => {
    ReactDOM.render(
      <Layout api={api} />,
      document.getElementById('vcv-wpbackend-layout-content')
    )
    let dnd = new DndManager(api)
    dnd.init()
    let controls = new WipControlsManager(api)
    let options = {
      iframeContainer: document.querySelector('.vcv-wpbackend-layout-content-container'),
      iframeOverlay: document.querySelector('#vcv-wpbackend-layout-content-overlay'),
      iframe: document.querySelector('#vcv-wpbackend-layout-content-overlay'),
      iframeWindow: document.defaultView,
      iframeDocument: document
    }

    controls.init(options)
  })
}
