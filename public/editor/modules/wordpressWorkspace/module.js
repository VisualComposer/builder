import { add, getStorage, getService, env, setData, getData, onDataChange } from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import WorkspaceCont from 'public/components/workspace/workspaceCont'
import StartBlankPanel from 'public/components/startBlank/StartBlankPanel'

const workspaceStorage = getStorage('workspace')
const wordpressDataStorage = getStorage('wordpressData')
const elementsStorage = getStorage('elements')
const assetsStorage = getStorage('assets')
const settingsStorage = getStorage('settings')
const utils = getService('utils')

add('wordpressWorkspace', (api) => {
  console.log('editor started')
  window.timer = Date.now()
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
    }
  })

  if (env('VCV_JS_THEME_LAYOUTS')) {
    settingsStorage.state('headerTemplate').onChange((value) => {
      // Add Header template ID to extra save args
      let args = settingsStorage.state('saveExtraArgs').get() || {}
      settingsStorage.state('saveExtraArgs').set(Object.assign({}, args, { 'vcv-header-id': value }))
    })

    settingsStorage.state('sidebarTemplate').onChange((value) => {
      // Add Sidebar template ID to extra save args
      let args = settingsStorage.state('saveExtraArgs').get() || {}
      settingsStorage.state('saveExtraArgs').set(Object.assign({}, args, { 'vcv-sidebar-id': value }))
    })

    settingsStorage.state('footerTemplate').onChange((value) => {
      // Add Footer template ID to extra save args
      let args = settingsStorage.state('saveExtraArgs').get() || {}
      settingsStorage.state('saveExtraArgs').set(Object.assign({}, args, { 'vcv-footer-id': value }))
    })
  }

  let isDragging = false
  const handleBodyMouseUp = () => {
    const data = getData('vcv:layoutCustomMode')
    let newData
    if (data.options.container && data.options.container.id === 'vcv-editor-iframe-overlay') {
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

  let layoutHeader = document.getElementById('vcv-layout-header')
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
      <WorkspaceCont />,
      layoutHeader
    )
  }

  // Start blank overlay
  let iframeContent = document.getElementById('vcv-layout-iframe-content')

  if (iframeContent) {
    const removeStartBlank = () => {
      ReactDOM.unmountComponentAtNode(iframeContent)
    }
    const addStartBlank = () => {
      console.log('editor loaded', Date.now() - window.timer)

      ReactDOM.render(
        <StartBlankPanel unmountStartBlank={removeStartBlank} />,
        iframeContent
      )
    }
    const removeOverlay = () => {
      iframeContent.querySelector('.vcv-loading-overlay') && iframeContent.querySelector('.vcv-loading-overlay').remove()
      document.querySelector('.vcv-layout-bar-header') && document.querySelector('.vcv-layout-bar-header').classList.remove('vcv-layout-bar-header--loading')
    }
    let documentElements
    let isBlank = true

    elementsStorage.state('document').onChange((data, elements) => {
      documentElements = elements
      if (data.length === 0) {
        let showBlank = true
        let currentTemplate = settingsStorage.state('pageTemplate').get() || (window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT && window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT())
        if (currentTemplate && currentTemplate.type !== 'vc' && currentTemplate.value !== 'blank') {
          showBlank = false
        }

        if (showBlank && !settingsStorage.state('skipBlank').get()) {
          addStartBlank()
          isBlank = true
          document.querySelector('.vcv-layout-bar-header') && document.querySelector('.vcv-layout-bar-header').classList.remove('vcv-layout-bar-header--loading')
        } else {
          removeOverlay()
        }
      } else if (data.length && isBlank) {
        let visibleElements = utils.getVisibleElements(documentElements)
        if (!Object.keys(visibleElements).length) {
          removeOverlay()
        }
        removeStartBlank()
        isBlank = false
      }
      settingsStorage.state('skipBlank').set(false)
    })

    assetsStorage.state('jobs').onChange((data) => {
      if (documentElements) {
        let visibleJobs = data.elements.filter(element => !element.hidden)
        let visibleElements = utils.getVisibleElements(documentElements)
        let documentIds = Object.keys(visibleElements)
        if (documentIds.length === visibleJobs.length) {
          let jobsInprogress = data.elements.find(element => element.jobs)
          if (jobsInprogress) {
            return
          }
          removeOverlay()
        }
      }
    })
  }
})
