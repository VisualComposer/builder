import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import Editor from './lib/editor'
import $ from 'jquery'
import DndManager from './lib/dndManager'
import ControlsManager from './lib/controlsIframe/controlsManager'
import MobileControlsManager from './lib/controlsIframe/mobileControlsManager'
import MobileDetect from 'mobile-detect'

vcCake.add('contentModernLayout', (api) => {
  let domContainer = $('#vcv-editor', $('#vcv-editor-iframe').get(0).contentWindow.document).get(0)
  ReactDOM.render(
    <Editor api={api} />,
    domContainer
  )
  let dnd = new DndManager(api)
  dnd.init()

  if (vcCake.env('MOBILE_DETECT')) {
    const mobileDetect = new MobileDetect(window.navigator.userAgent)
    if (mobileDetect.mobile()) {
      if (mobileDetect.tablet()) {
        let mobileControls = new MobileControlsManager(api)
        mobileControls.init()
      }
      return
    }
  }

  let controls = new ControlsManager(api)
  controls.init()
})
