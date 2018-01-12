import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import Editor from './lib/editor'
import DndManager from './lib/dndManager'
import ControlsManager from './lib/controlsIframe/controlsManager'
import MobileControlsManager from './lib/controlsIframe/mobileControlsManager'
import Notifications from './lib/notifications'
import MobileDetect from 'mobile-detect'
import OopsScreen from '../../../../resources/components/oopsScreen/component'

const Utils = vcCake.getService('utils')
const workspaceStorage = vcCake.getStorage('workspace')
const workspaceNotifications = workspaceStorage.state('notifications')
const workspaceIFrame = workspaceStorage.state('iframe')
const elementsStorage = vcCake.getStorage('elements')
const assetsStorage = vcCake.getStorage('assets')

vcCake.add('contentModernLayout', (api) => {
  let iframeContent = vcCake.env('IFRAME_RELOAD') && document.getElementById('vcv-layout-iframe-content')
  let dnd = new DndManager(api)
  let controls = new ControlsManager(api)
  let notifications = vcCake.env('UI_NOTIFICATIONS') && (new Notifications(document.querySelector('.vcv-layout-iframe-overlay'), 10))

  if (Utils.isRTL()) {
    document.body && document.body.classList.add('rtl')
  }

  const renderLayout = (reload = false) => {
    /* 'REFACTOR_ELEMENT_ACCESS_POINT' uncomment to enable public ElementAPI in browser console */
    // let elementAccessPoint = vcCake.env('REFACTOR_ELEMENT_ACCESS_POINT') ? vcCake.getService('elementAccessPoint') : null
    // elementAccessPoint && (window.elAP = elementAccessPoint)
    /* */
    if (vcCake.env('IFRAME_RELOAD')) {
      workspaceIFrame.ignoreChange(reloadLayout)
      workspaceIFrame.set(false)
    }
    let iframe = document.getElementById('vcv-editor-iframe')
    let iframeWindow = iframe ? iframe.contentWindow : null
    let domContainer = iframeWindow ? iframeWindow.document.getElementById('vcv-editor') : null
    if (domContainer) {
      ReactDOM.render(
        <Editor api={api} />,
        domContainer
      )

      !reload && dnd.init()

      if (vcCake.env('UI_NOTIFICATIONS')) {
        !reload && notifications.init()
      }

      if (vcCake.env('IFRAME_RELOAD')) {
        workspaceIFrame.onChange(reloadLayout)
      }

      if (vcCake.env('MOBILE_DETECT')) {
        const mobileDetect = new MobileDetect(window.navigator.userAgent)
        if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
          const localizations = window.VCV_I18N && window.VCV_I18N()
          let mobileControls = new MobileControlsManager(api)
          mobileControls.init()

          if (vcCake.env('UI_NOTIFICATIONS')) {
            workspaceNotifications.set({
              position: 'bottom',
              transparent: true,
              rounded: true,
              text: localizations.mobileTooltipText || 'Double tap on an element to open the edit window. Tap and hold to initiate drag and drop in a Tree view.',
              cookie: 'vcv-mobile-tooltip',
              time: 10000
            })
            return
          } else {
            let disableTooltip = Utils.getCookie('vcv-mobile-tooltip') || false
            if (!disableTooltip) {
              let iframeOverlay = document.querySelector('.vcv-layout-iframe-overlay')
              let mobileTooltip = document.createElement('div')
              mobileTooltip.className = 'vcv-ui-mobile-tooltip'
              mobileTooltip.innerText = localizations.mobileTooltipText || 'Double tap on an element to open the edit window. Tap and hold to initiate drag and drop in a Tree view.'
              mobileTooltip.addEventListener('click', () => {
                if (!disableTooltip) {
                  mobileTooltip.className += ' disabled'
                  disableTooltip = true
                  Utils.setCookie('vcv-mobile-tooltip', true)
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
      }
      reload ? controls.updateIframeVariables() : controls.init()
    } else {
      document.body.innerHTML = `<div id='vcv-oops-screen-container'></div>`
      let oopsContainer = document.getElementById('vcv-oops-screen-container')
      if (oopsContainer) {
        ReactDOM.render(
          <OopsScreen error={window.vcvFeError || 'default'} />,
          oopsContainer
        )
      }
    }
  }

  const createLoadingScreen = () => {
    iframeContent.innerHTML = `<div class='vcv-loading-overlay'>
        <div class='vcv-loading-overlay-inner'>
          <div class='vcv-loading-dots-container'>
            <div class='vcv-loading-dot vcv-loading-dot-1'></div>
            <div class='vcv-loading-dot vcv-loading-dot-2'></div>
          </div>
        </div>
      </div>`
  }

  const reloadLayout = ({ type, template }) => {
    if (type === 'reload') {
      createLoadingScreen()
      let iframe = window.document.getElementById('vcv-editor-iframe')
      let domContainer = iframe.contentDocument.getElementById('vcv-editor')
      ReactDOM.unmountComponentAtNode(domContainer)
      let data = vcCake.getService('document').all()
      iframe.onload = () => {
        let visibleElements = vcCake.getService('utils').getVisibleElements(data)
        workspaceIFrame.set({ type: 'loaded' })
        elementsStorage.trigger('updateAll', data)
        assetsStorage.trigger('updateAllElements', visibleElements)
        const settingsStorage = vcCake.getStorage('settings')
        const customCssState = settingsStorage.state('customCss')
        const globalCssState = settingsStorage.state('globalCss')
        const localJsState = settingsStorage.state('localJs')
        const globalJsState = settingsStorage.state('globalJs')
        if (customCssState.get()) {
          customCssState.set(customCssState.get())
        }
        if (globalCssState.get()) {
          globalCssState.set(globalCssState.get())
        }
        if (vcCake.env('CUSTOM_JS')) {
          if (localJsState.get()) {
            localJsState.set(localJsState.get())
          }
          if (globalJsState.get()) {
            globalJsState.set(globalJsState.get())
          }
        }
      }
      let url = iframe.src.split('?')
      let params = url[ 1 ].split('&')
      for (let i = 0; i < params.length; i++) {
        if (params[ i ].indexOf('vcv-template') >= 0) {
          params.splice(i, 1)
          break
        }
      }
      if (template) {
        params.push(`vcv-template=${template}`)
      }
      url[ 1 ] = params.join('&')
      iframe.src = url.join('?')
    } else if (type === 'loaded') {
      renderLayout(true)
    }
  }

  renderLayout()
})
