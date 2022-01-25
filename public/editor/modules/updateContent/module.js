import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import Editor from './lib/editor'
import { Provider } from 'react-redux'
import store from 'public/editor/stores/store'

vcCake.add('updateContent', (api) => {
  // disable this module on regular editor
  // TODO: check this functionality
  if (typeof window.vcvRebuildPostSave === 'undefined') {
    console.warn('TODO: check is vcvRebuildPostSave works properly')
    return
  }
  const iframe = document.getElementById('vcv-editor-iframe')
  const iframeWindow = iframe ? iframe.contentWindow : null
  const domContainer = iframeWindow ? iframeWindow.document.getElementById('vcv-editor') : null
  if (domContainer) {
    ReactDOM.render(
      <Provider store={store}>
        <Editor api={api} />
      </Provider>,
      domContainer
    )
  }
})
