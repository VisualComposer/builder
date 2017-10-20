import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import Editor from './lib/editor'
import $ from 'jquery'
import DndManager from './lib/dndManager'
import ControlsManager from './lib/controlsIframe/controlsManager'
import MobileControlsManager from './lib/controlsIframe/mobileControlsManager'
import MobileDetect from 'mobile-detect'

const Utils = vcCake.getService('utils')

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
    if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
      let mobileControls = new MobileControlsManager(api)
      mobileControls.init()
      let disableTooltip = Utils.getCookie('mobile-tooltip') || false
      if (!disableTooltip) {
        let iframeOverlay = document.querySelector('.vcv-layout-iframe-overlay')
        let mobileTooltip = document.createElement('div')
        mobileTooltip.className = 'vcv-ui-mobile-tooltip'
        mobileTooltip.innerText = 'Double click on the element to open the edit window. Hold finger to initiate drag and drop in a Tree view.'
        mobileTooltip.addEventListener('click', () => {
          if (!disableTooltip) {
            mobileTooltip.className += ' disabled'
            disableTooltip = true
            Utils.setCookie('mobile-tooltip', true)
          }
        })
        iframeOverlay.appendChild(mobileTooltip)
        setTimeout(() => {
          if (!disableTooltip) {
            mobileTooltip.className += ' disabled'
            disableTooltip = true
          }
        }, 10000)
      }
      return
    }
  }

  let controls = new ControlsManager(api)
  controls.init()
})
