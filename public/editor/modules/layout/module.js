/* global VCV_PLUGIN_UPDATE */
import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from 'public/editor/stores/store'
import { notificationAdded } from 'public/editor/stores/notifications/slice'
import Editor from './lib/editor'
import DndManager from './lib/dndManager'
import ControlsManager from './lib/controlsIframe/controlsManager'
import RightClickMenu from 'public/components/rightClickMenu/rightClickMenu'
import MobileControlsManager from './lib/controlsIframe/mobileControlsManager'
import MobileDetect from 'mobile-detect'
import OopsScreen from 'public/components/account/oopsScreen'
import Notifications from 'public/components/notifications/notifications'
import Popup from 'public/components/popup/popupContainer'
import FullPagePopupContainer from 'public/components/popup/fullPagePopupContainer'
import Helpers from 'public/components/helpers/helpers'

const Utils = vcCake.getService('utils')
const workspaceStorage = vcCake.getStorage('workspace')
const workspaceSettings = workspaceStorage.state('settings')
const workspaceIFrame = workspaceStorage.state('iframe')
const elementsStorage = vcCake.getStorage('elements')
const assetsStorage = vcCake.getStorage('assets')
const dataManager = vcCake.getService('dataManager')

vcCake.add('contentLayout', (api) => {
  const iframeContent = document.getElementById('vcv-layout-iframe-content')
  const dnd = new DndManager(api)
  const controls = new ControlsManager(api)
  const rightClick = new RightClickMenu()

  const localizations = dataManager.get('localizations')
  if (Utils.isRTL()) {
    document.body && document.body.classList.add('rtl')
  }

  // Start notifications and editor popups
  const layoutOverlay = document.querySelector('.vcv-layout-overlay')
  if (layoutOverlay) {
    ReactDOM.render(
      <Provider store={store}>
        <Notifications />
        <Popup />
        <FullPagePopupContainer />
        {dataManager.get('showInitialHelpers') && <Helpers />}
      </Provider>,
      layoutOverlay
    )
  }

  const renderLayout = (reload = false) => {
    workspaceIFrame.ignoreChange(reloadLayout)
    workspaceIFrame.set(false)
    const iframe = document.getElementById('vcv-editor-iframe')
    const iframeWindow = iframe ? iframe.contentWindow : null
    const domContainer = iframeWindow ? iframeWindow.document.getElementById('vcv-editor') : null
    if (domContainer) {
      if (iframeWindow.vcv) {
        iframeWindow.vcv.trigger('ready')
      }
      ReactDOM.render(
        <Provider store={store}>
          <Editor api={api} />
        </Provider>,
        domContainer
      )

      !reload && dnd.init()
      rightClick.init()

      workspaceIFrame.onChange(reloadLayout)

      const updateNotificationEnabled = vcCake.env('VCV_FT_UPDATE_NOTIFICATION')
      const pluginUpdate = typeof VCV_PLUGIN_UPDATE === 'function' ? VCV_PLUGIN_UPDATE() : false
      pluginUpdate && updateNotificationEnabled && store.dispatch(notificationAdded({
        showCloseButton: true,
        type: 'warning',
        text: localizations.newPluginVersionIsAvailable || 'There is a new version of Visual Composer Website Builder available',
        html: true,
        time: -1
      }))

      const mobileDetect = new MobileDetect(window.navigator.userAgent)
      if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
        const mobileControls = new MobileControlsManager(api)
        mobileControls.init()
        store.dispatch(notificationAdded({
          text: localizations.mobileTooltipText || 'Double-tap on an element to open the edit window. Tap and hold to initiate drag and drop.',
          cookie: 'vcv-mobile-tooltip',
          time: 10000
        }))
        return
      }

      reload ? controls.updateIframeVariables() : controls.init()
      if (vcCake.env('VCV_JS_THEME_LAYOUTS')) {
        iframeWindow.document.querySelectorAll('[data-vcv-layout-zone]').forEach((zone) => {
          const zoneButton = zone.querySelector('[data-vcv-action="settings"]')
          zoneButton && zoneButton.addEventListener('click', () => {
            workspaceStorage.state('content').set('settings')
            workspaceSettings.set({ action: 'settings' })
          })
        })
      }
    } else {
      const postUpdateWrapper = document.querySelector('#vcv-posts-update-wrapper')
      let wrapper = document.body

      if (postUpdateWrapper) {
        const postUpdateIframe = postUpdateWrapper.querySelector('.vcv-layout-iframe')
        wrapper = postUpdateIframe && postUpdateIframe.contentWindow.document.body
      }

      wrapper.innerHTML = '<div id=\'vcv-oops-screen-container\'></div>'
      const oopsContainer = document.getElementById('vcv-oops-screen-container')
      if (oopsContainer) {
        ReactDOM.render(
          <div className='vcv-screen-section'>
            <OopsScreen errorName={dataManager.get('frontEndError')} />
          </div>,
          oopsContainer
        )
      }
    }
  }

  const removeLoadingScreen = () => {
    let loadingOverlays = iframeContent.querySelectorAll('.vcv-loading-overlay')
    loadingOverlays = [].slice.call(loadingOverlays)
    loadingOverlays.forEach((loadingOverlay) => {
      loadingOverlay.remove()
    })
  }

  const createLoadingScreen = () => {
    removeLoadingScreen()
    const loadingOverlay = document.createElement('div')
    loadingOverlay.classList.add('vcv-loading-overlay')
    loadingOverlay.innerHTML = `<div class='vcv-loading-overlay-inner'>
        <div class='vcv-loading-dots-container'>
          <div class='vcv-loading-dot vcv-loading-dot-1'></div>
          <div class='vcv-loading-dot vcv-loading-dot-2'></div>
        </div>
      </div>`
    const startBlank = iframeContent.querySelector('.vcv-start-blank-container')
    if (startBlank) {
      iframeContent.insertBefore(loadingOverlay, startBlank)
    } else {
      iframeContent.appendChild(loadingOverlay)
    }
  }

  const reloadLayout = ({ type, template, header, sidebar, footer }) => {
    if (type === 'reload') {
      createLoadingScreen()
      const iframe = window.document.getElementById('vcv-editor-iframe')
      const domContainer = iframe.contentDocument.getElementById('vcv-editor')
      if (domContainer) {
        ReactDOM.unmountComponentAtNode(domContainer)
      }
      iframe.onload = () => {
        assetsStorage.trigger('reset')
        const data = vcCake.getService('document').all()
        const visibleElements = Utils.getVisibleElements(data)

        const setIframeLoaded = () => {
          workspaceIFrame.set({ type: 'layoutLoaded' })
          elementsStorage.off('elementsRenderDone', setIframeLoaded)
        }

        elementsStorage.on('elementsRenderDone', setIframeLoaded)

        workspaceIFrame.set({ type: 'loaded' })
        window.setTimeout(() => {
          elementsStorage.trigger('updateAll', data)
          assetsStorage.trigger('updateAllElements', visibleElements)
        }, 1)
      }
      const url = iframe.src.split('?')
      let params = url[1].split('&')
      params = params.reduce((arr, item) => {
        let write = true
        if (item.indexOf('vcv-template') >= 0) {
          write = false
        }
        if (item.indexOf('vcv-nonce') >= 0) {
          write = false
        }
        if (vcCake.env('VCV_JS_THEME_LAYOUTS')) {
          if (
            item.indexOf('vcv-header') >= 0 ||
            item.indexOf('vcv-sidebar') >= 0 ||
            item.indexOf('vcv-footer') >= 0
          ) {
            write = false
          }
        }
        write && arr.push(item)
        return arr
      }, [])
      params.push(`vcv-nonce=${dataManager.get('pageEditableNonce')}`)
      if (template) {
        params.push(`vcv-template=${template.value}`)
        params.push(`vcv-template-type=${template.type}`)
        params.push(`vcv-template-stretched=${template.stretchedContent ? 1 : 0}`)

        let hasHeader = false
        let hasSidebar = false
        let hasFooter = false
        const layouts = dataManager.get('pageTemplatesLayouts')
        const currentLayoutType = layouts && layouts.find(item => item.type === template.type)
        if (currentLayoutType && currentLayoutType.values) {
          const currentTemplate = currentLayoutType.values.find(item => item.value === template.value)
          if (currentTemplate) {
            hasHeader = currentTemplate.header
            hasSidebar = currentTemplate.sidebar
            hasFooter = currentTemplate.footer
          }
        }
        const isLayoutTheme = template.type === 'vc-custom-layout' && (template.value + '').indexOf('theme:') !== -1
        if (template.type === 'theme' || isLayoutTheme) {
          hasHeader = true
          hasFooter = true
        }
        if (vcCake.env('VCV_JS_THEME_LAYOUTS')) {
          if (hasHeader && header) {
            params.push(`vcv-header=${header}`)
          }
          if (hasSidebar && sidebar) {
            params.push(`vcv-sidebar=${sidebar}`)
          }
          if (hasFooter && footer) {
            params.push(`vcv-footer=${footer}`)
          }
        }
      }
      url[1] = params.join('&')
      iframe.src = url.join('?')
    } else if (type === 'loaded') {
      renderLayout(true)
    } else if (type === 'layoutLoaded') {
      removeLoadingScreen()
    }
  }

  renderLayout()
})
