import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import Editor from './lib/editor'

vcCake.add('updateContent', (api) => {
  const iframe = document.getElementById('vcv-editor-iframe')
  const iframeWindow = iframe ? iframe.contentWindow : null
  const domContainer = iframeWindow ? iframeWindow.document.getElementById('vcv-editor') : null
  if (domContainer) {
    ReactDOM.render(
      <Editor api={api} />,
      domContainer
    )
  }
})
