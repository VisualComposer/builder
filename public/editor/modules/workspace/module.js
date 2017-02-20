import {add} from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import Workspace from './components/workspace'

add('workspace', () => {
  let layoutHeader = document.getElementById('vcv-layout-header')
  ReactDOM.render(
    <Workspace />,
    layoutHeader
  )
})
