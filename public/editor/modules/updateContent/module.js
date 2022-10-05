import vcCake from 'vc-cake'
import React from 'react'
import { createRoot } from 'react-dom/client'
import Editor from './lib/editor'
import { Provider } from 'react-redux'
import store from 'public/editor/stores/store'

vcCake.add('updateContent', (api) => {
  // disable this module on regular editor
  if (typeof window.vcvRebuildPostSave === 'undefined') {
    return
  }
  const iframe = document.getElementById('vcv-editor-iframe')
  const iframeWindow = iframe ? iframe.contentWindow : null
  const domContainer = iframeWindow ? iframeWindow.document.getElementById('vcv-editor') : null
  if (domContainer) {
    const root = createRoot(domContainer)
    root.render(
      <Provider store={store}>
        <Editor api={api} />
      </Provider>
    )
  }
})
