import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import Editor from './lib/editor'
import $ from 'jquery'
import DndManager from './lib/dndManager'
import WipControlsManager from './lib/controlsIframe/wipControlsManager'

vcCake.add('contentLayout', (api) => {
  let domContainer = $('#vcv-editor', $('#vcv-editor-iframe').get(0).contentWindow.document).get(0)
  ReactDOM.render(
    <Editor api={api} />,
    domContainer
  )
  let dnd = new DndManager(api)
  dnd.init()
  let controls = new WipControlsManager(api)
  controls.init()
})
