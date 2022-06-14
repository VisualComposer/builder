import { add, getStorage, getService, env, setData, getData, onDataChange } from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import WorkspaceCont from 'public/components/workspace/workspaceCont'
// import BlankPageIntro from 'public/components/blankPageIntro/blankPageIntro'
import { Provider } from 'react-redux'
import store from 'public/editor/stores/store'
import { notificationAdded } from 'public/editor/stores/notifications/slice'

const workspaceStorage = getStorage('workspace')
const wordpressDataStorage = getStorage('wordpressData')
const elementsStorage = getStorage('elements')
const assetsStorage = getStorage('assets')
const settingsStorage = getStorage('settings')
const utils = getService('utils')
const dataManager = getService('dataManager')

add('wordpressWorkspace', (api) => {
  api.reply('start', () => {
    wordpressDataStorage.trigger('start')
  })
  workspaceStorage.state('settings').onChange((settings) => {
    if (!settings || !settings.action) {
      workspaceStorage.state('content').set(false)
      return
    }
    if (settings.action === 'add') {
      workspaceStorage.state('content').set('addElement')
    } else if (settings.action === 'addHub') {
      workspaceStorage.state('content').set('addHubElement')
    } else if (settings.action === 'edit') {
      workspaceStorage.state('content').set('editElement')
    } else if (settings.action === 'addTemplate') {
      workspaceStorage.state('content').set('addTemplate')
    } else if (settings.action === 'addBlock') {
      workspaceStorage.state('content').set('addBlock')
    }
  })

  if (env('VCV_JS_THEME_LAYOUTS')) {
    settingsStorage.state('headerTemplate').onChange((value) => {
      // Add Header template ID to extra save args
      const args = settingsStorage.state('saveExtraArgs').get() || {}
      settingsStorage.state('saveExtraArgs').set(Object.assign({}, args, { 'vcv-header-id': value }))
    })

    settingsStorage.state('sidebarTemplate').onChange((value) => {
      // Add Sidebar template ID to extra save args
      const args = settingsStorage.state('saveExtraArgs').get() || {}
      settingsStorage.state('saveExtraArgs').set(Object.assign({}, args, { 'vcv-sidebar-id': value }))
    })

    settingsStorage.state('footerTemplate').onChange((value) => {
      // Add Footer template ID to extra save args
      const args = settingsStorage.state('saveExtraArgs').get() || {}
      settingsStorage.state('saveExtraArgs').set(Object.assign({}, args, { 'vcv-footer-id': value }))
    })
  }

  let isDragging = false
  const handleBodyMouseUp = () => {
    const data = getData('vcv:layoutCustomMode')
    let newData
    if (data.options.containerId === 'vcv-editor-iframe-overlay') {
      newData = {
        mode: 'headerDrop',
        options: {}
      }
    } else {
      newData = {
        mode: 'dnd',
        options: data
      }
    }
    setData('vcv:layoutCustomMode', newData)
    layoutHeader.removeEventListener('mouseup', handleBodyMouseUp.bind(this, data))
    isDragging = false
  }

  const layoutHeader = document.getElementById('vcv-layout-header')
  if (layoutHeader) {
    onDataChange('vcv:layoutCustomMode', (data) => {
      if (data && data.mode === 'dnd' && !isDragging) {
        layoutHeader.addEventListener('mouseup', handleBodyMouseUp)
        isDragging = true
      } else if (isDragging) {
        layoutHeader.removeEventListener('mouseup', handleBodyMouseUp)
        isDragging = false
      }
    })

    ReactDOM.render(
      <Provider store={store}>
        <WorkspaceCont />
      </Provider>,
      layoutHeader
    )
  }

  // Start blank overlay
  const iframeContent = document.getElementById('vcv-layout-iframe-content')

  if (iframeContent) {
    // const removeBlankIntro = () => {
    //   ReactDOM.unmountComponentAtNode(iframeContent)
    //   workspaceStorage.state('navbarDisabled').set(false)
    //   isBlankPageIntro = false
    // }
    // const addBlankIntro = () => {
    //   ReactDOM.render(
    //     <BlankPageIntro unmountBlankPage={removeBlankIntro} />,
    //     iframeContent
    //   )
    //   workspaceStorage.state('navbarDisabled').set(true)
    // }
    const removeOverlay = () => {
      iframeContent.querySelector('.vcv-loading-overlay') && iframeContent.querySelector('.vcv-loading-overlay').remove()
      workspaceStorage.state('navbarDisabled').set(false)
      // Remove Current Post Source-CSS to avoid cascading issues
      const sourceCss = env('iframe').document.querySelector('link[id*="assets:source:main:styles"][href$="-' + dataManager.get('sourceID') + '"]')
      if (sourceCss) {
        sourceCss.remove()
      }
    }
    let documentElements
    let isBlankPageIntro = true

    elementsStorage.state('document').onChange((data, elements) => {
      documentElements = elements
      if (data.length === 0) {
        if (isBlankPageIntro && !settingsStorage.state('skipBlank').get()) {
          // addBlankIntro()
          isBlankPageIntro = false
        } else {
          isBlankPageIntro = false
          removeOverlay()
        }
      } else if (data.length && isBlankPageIntro) {
        const visibleElements = utils.getVisibleElements(documentElements)
        if (!Object.keys(visibleElements).length) {
          removeOverlay()
        }
        // removeBlankIntro()
        isBlankPageIntro = false
      } else {
        workspaceStorage.state('navbarDisabled').set(false)
      }
      settingsStorage.state('skipBlank').set(false)
    })

    let isTutorialNotificationShown = false
    assetsStorage.state('jobs').onChange((data) => {
      if (documentElements) {
        const visibleJobs = data.elements.filter(element => !element.hidden)
        const visibleElements = utils.getVisibleElements(documentElements)
        const documentIds = Object.keys(visibleElements)
        if (documentIds.length === visibleJobs.length) {
          const jobsInprogress = data.elements.find(element => element.jobs)
          if (jobsInprogress) {
            return
          }
          removeOverlay()
          if (dataManager.get('editorType') === 'vcv_tutorials' && !isTutorialNotificationShown) {
            isTutorialNotificationShown = true
            const localizations = dataManager.get('localizations')
            const tutorialPageMessage = localizations.tutorialPageNotification || 'This page can not be saved, because it is made for the demo purposes only.'
            store.dispatch(notificationAdded({
              text: tutorialPageMessage,
              time: 5000
            }))
          }
        }
      }
    })
  }
})
