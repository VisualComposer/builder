import vcCake from 'vc-cake'
import ReactDOM from 'react-dom'
import React from 'react'
import Layout from './lib/layout'
import DndManager from './lib/dnd/dndManager'

if (vcCake.env('FEATURE_WPBACKEND')) {
  vcCake.add('backendLayout', (api) => {
    ReactDOM.render(
      <Layout api={api} />,
      document.getElementById('vcv-wpbackend-layout-content')
    )
    let dnd = new DndManager(api)
    dnd.init()
  })
}
