/* global VCV_PLUGIN_UPDATE */
import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import Editor from './lib/editor'
import DndManager from './lib/dndManager'
import ControlsManager from './lib/controlsIframe/controlsManager'
import MobileControlsManager from './lib/controlsIframe/mobileControlsManager'
import Notifications from './lib/notifications'
import MobileDetect from 'mobile-detect'
import OopsScreen from 'public/components/account/oopsScreen'

const Utils = vcCake.getService('utils')
const workspaceStorage = vcCake.getStorage('workspace')
const workspaceNotifications = workspaceStorage.state('notifications')
const workspaceSettings = workspaceStorage.state('settings')
const workspaceIFrame = workspaceStorage.state('iframe')
const elementsStorage = vcCake.getStorage('elements')
const assetsStorage = vcCake.getStorage('assets')

vcCake.add('contentLayout', (api) => {
  let iframeContent = document.getElementById('vcv-layout-iframe-content')
  let dnd = new DndManager(api)
  let controls = new ControlsManager(api)
  let notifications = new Notifications(document.querySelector('.vcv-layout-overlay'), 10)
  const localizations = window.VCV_I18N && window.VCV_I18N()
  if (Utils.isRTL()) {
    document.body && document.body.classList.add('rtl')
  }

  const renderLayout = (reload = false) => {
    /* 'REFACTOR_ELEMENT_ACCESS_POINT' uncomment to enable public ElementAPI in browser console */
    // let elementAccessPoint = vcCake.getService('elementAccessPoint')
    // elementAccessPoint && (window.elAP = elementAccessPoint)
    /* */
    workspaceIFrame.ignoreChange(reloadLayout)
    workspaceIFrame.set(false)
    let iframe = document.getElementById('vcv-editor-iframe')
    let iframeWindow = iframe ? iframe.contentWindow : null
    let domContainer = iframeWindow ? iframeWindow.document.getElementById('vcv-editor') : null
    if (domContainer) {
      ReactDOM.render(
        <Editor api={api} />,
        domContainer
      )

      !reload && dnd.init()
      !reload && notifications.init()

      workspaceIFrame.onChange(reloadLayout)

      const pluginUpdate = typeof VCV_PLUGIN_UPDATE === 'function' ? VCV_PLUGIN_UPDATE() : false
      pluginUpdate && workspaceNotifications.set({
        position: 'top',
        transparent: false,
        showCloseButton: true,
        rounded: false,
        type: 'warning',
        text: localizations.newPluginVersionIsAvailable || `There is a new version of Visual Composer Website Builder available`,
        html: true,
        cookie: {
          name: 'vcv-update-notice',
          expireInDays: 1
        },
        time: 5000
      })

      const mobileDetect = new MobileDetect(window.navigator.userAgent)
      if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
        let mobileControls = new MobileControlsManager(api)
        mobileControls.init()

        workspaceNotifications.set({
          position: 'bottom',
          transparent: true,
          rounded: true,
          text: localizations.mobileTooltipText || 'Double tap on an element to open the edit window. Tap and hold to initiate drag and drop in a Tree view.',
          cookie: 'vcv-mobile-tooltip',
          time: 10000
        })
        return
      }

      reload ? controls.updateIframeVariables() : controls.init()
      if (vcCake.env('VCV_JS_THEME_LAYOUTS')) {
        iframeWindow.document.querySelectorAll('[data-vcv-layout-zone]').forEach((zone) => {
          let zoneButton = zone.querySelector('[data-vcv-action="settings"]')
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

      wrapper.innerHTML = `<div id='vcv-oops-screen-container'></div>`
      let oopsContainer = document.getElementById('vcv-oops-screen-container')
      if (oopsContainer) {
        ReactDOM.render(
          <div className='vcv-screen-section'>
            <OopsScreen errorName={window.vcvFeError || 'default'} />
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
      let iframe = window.document.getElementById('vcv-editor-iframe')
      let domContainer = iframe.contentDocument.getElementById('vcv-editor')
      if (domContainer) {
        ReactDOM.unmountComponentAtNode(domContainer)
      }
      iframe.onload = () => {
        const data = vcCake.getService('document').all()
        const visibleElements = Utils.getVisibleElements(data)
        workspaceIFrame.set({ type: 'loaded' })
        elementsStorage.trigger('updateAll', data)
        assetsStorage.trigger('updateAllElements', visibleElements)
      }
      let url = iframe.src.split('?')
      let params = url[ 1 ].split('&')
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
      params.push(`vcv-nonce=${window.vcvNonce}`)
      if (template) {
        params.push(`vcv-template=${template.value}`)
        params.push(`vcv-template-type=${template.type}`)
        params.push(`vcv-template-stretched=${template.stretchedContent ? 1 : 0}`)

        let hasHeader = false
        let hasSidebar = false
        let hasFooter = false
        let currentLayoutType = window.VCV_PAGE_TEMPLATES_LAYOUTS && window.VCV_PAGE_TEMPLATES_LAYOUTS() && window.VCV_PAGE_TEMPLATES_LAYOUTS().find(item => item.type === template.type)
        if (currentLayoutType && currentLayoutType.values) {
          let currentTemplate = currentLayoutType.values.find(item => item.value === template.value)
          if (currentTemplate) {
            hasHeader = currentTemplate.header
            hasSidebar = currentTemplate.sidebar
            hasFooter = currentTemplate.footer
          }
        }
        if (template.type === 'theme') {
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
      url[ 1 ] = params.join('&')
      iframe.src = url.join('?')
    } else if (type === 'loaded') {
      renderLayout(true)
      removeLoadingScreen()
    }
  }

  renderLayout()

  assetsStorage.state('jobs').onChange((data) => {
    let documentElements = vcCake.getService('document').all()
    if (documentElements) {
      let visibleJobs = data.elements.filter(element => !element.hidden)
      let visibleElements = Utils.getVisibleElements(documentElements)
      let documentIds = Object.keys(visibleElements)
      if (documentIds.length === visibleJobs.length) {
        let jobsInprogress = data.elements.find(element => element.jobs)
        if (jobsInprogress) {
          return
        }
        elementsStorage.trigger('elementsCssBuildDone', data)
      }
    }
  })

  elementsStorage.on('elementsCssBuildDone', () => {
    // need wait until latest element will be rendered
    let timer = null
    const renderDone = () => {
      elementsStorage.trigger('elementsRenderDone')
    }
    api.on('element:didUpdate', () => {
      window.clearTimeout(timer)
      timer = null
      timer = window.setTimeout(renderDone, 150)
    })

    timer = window.setTimeout(renderDone, 200)
  })
})
