import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import LayoutBar from './lib/layout'

vcCake.add('ui-layout-bar', (api) => {
  let layoutHeader = document.getElementById('vcv-layout-header')
  ReactDOM.render(
    <LayoutBar api={api} />,
    layoutHeader
  )
})
