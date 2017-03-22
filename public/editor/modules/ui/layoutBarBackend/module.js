import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import LayoutBar from './lib/layout'

vcCake.add('ui-layout-bar', (api) => {
  const layoutHeader = document.getElementById('vcv-wpbackend-layout-header')
  const layout = document.getElementById('vcv-layout')
  ReactDOM.render(
    <LayoutBar api={api} layout={layout} />,
    layoutHeader
  )
})
