import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import Editor from './lib/editor'

vcCake.add('contentBackendContent', (api) => {
  let domContainer = document.getElementById('vcv-editor-iframe')
  ReactDOM.render(
    <Editor api={api} />,
    domContainer
  )
})
