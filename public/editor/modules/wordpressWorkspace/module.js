import { add, getStorage, getService, env } from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import WorkspaceCont from './containers/workspaceCont'
import StartBlankPanel from '../../../resources/components/startBlank/StartBlankPanel'

const workspaceStorage = getStorage('workspace')
const wordpressDataStorage = getStorage('wordpressData')
const elementsStorage = getStorage('elements')
const assetsStorage = getStorage('assets')
const settingsStorage = getStorage('settings')
const utils = getService('utils')
const workspaceIFrame = workspaceStorage.state('iframe')

add('wordpressWorkspace', (api) => {
  // Set Templates
  api.reply('start', () => {
    wordpressDataStorage.trigger('start')
  })
  workspaceStorage.state('settings').onChange((settings) => {
    if (env('NAVBAR_SINGLE_CONTENT')) {
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
      return
    }

    if (!settings || !settings.action) {
      workspaceStorage.state('contentEnd').set(false)
      return
    }
    if (settings.action === 'add') {
      workspaceStorage.state('contentEnd').set('addElement')
    } else if (settings.action === 'addHub') {
      workspaceStorage.state('contentEnd').set('addHubElement')
    } else if (settings.action === 'edit') {
      workspaceStorage.state('contentEnd').set('editElement')
    } else if (settings.action === 'addTemplate') {
      workspaceStorage.state('contentEnd').set('addTemplate')
    }
  })

  if (env('THEME_LAYOUTS')) {
    settingsStorage.state('headerTemplate').onChange((value) => {
      console.log('settingsStorage, headerTemplate onChange', value)
      // Add Header template ID to extra save args
      let args = settingsStorage.state('saveExtraArgs').get() || {}
      settingsStorage.state('saveExtraArgs').set(Object.assign({}, args, { 'vcv-header-id': value }))
    })

    settingsStorage.state('sidebarTemplate').onChange((value) => {
      console.log('settingsStorage, sidebarTemplate onChange', value)
      // Add Sidebar template ID to extra save args
      let args = settingsStorage.state('saveExtraArgs').get() || {}
      settingsStorage.state('saveExtraArgs').set(Object.assign({}, args, { 'vcv-sidebar-id': value }))
    })

    settingsStorage.state('footerTemplate').onChange((value) => {
      console.log('settingsStorage, footerTemplate onChange', value)
      // Add Footer template ID to extra save args
      let args = settingsStorage.state('saveExtraArgs').get() || {}
      settingsStorage.state('saveExtraArgs').set(Object.assign({}, args, { 'vcv-footer-id': value }))
    })
  }

  let layoutHeader = document.getElementById('vcv-layout-header')
  if (layoutHeader) {
    ReactDOM.render(
      <WorkspaceCont />,
      layoutHeader
    )
  }

  // Start blank overlay
  let iframeContent = document.getElementById('vcv-layout-iframe-content')

  if (iframeContent) {
    let selectedLayoutInBlank = window.VCV_PAGE_TEMPLATES && window.VCV_PAGE_TEMPLATES() && window.VCV_PAGE_TEMPLATES().current || 'default'
    const updateSelectedLayoutInBlank = (layout) => {
      selectedLayoutInBlank = layout
    }
    settingsStorage.state('selectedLayoutInBlank').onChange(updateSelectedLayoutInBlank)
    const removeStartBlank = () => {
      ReactDOM.unmountComponentAtNode(iframeContent)
    }
    const addStartBlank = () => {
      ReactDOM.render(
        <StartBlankPanel unmountStartBlank={removeStartBlank} updateSelectedLayoutInBlank={updateSelectedLayoutInBlank} />,
        iframeContent
      )
    }
    let documentElements
    let isBlank = true

    elementsStorage.state('document').onChange((data, elements) => {
      documentElements = elements
      if (data.length === 0) {
        if (!settingsStorage.state('skipBlank').get()) {
          addStartBlank()
          isBlank = true
        } else {
          iframeContent.querySelector('.vcv-loading-overlay') && iframeContent.querySelector('.vcv-loading-overlay').remove()
        }
      } else if (data.length && isBlank) {
        let visibleElements = utils.getVisibleElements(documentElements)
        if (!Object.keys(visibleElements).length) {
          iframeContent.querySelector('.vcv-loading-overlay') && iframeContent.querySelector('.vcv-loading-overlay').remove()
        }
        if (!env('CSS_LOADING')) {
          iframeContent.querySelector('.vcv-loading-overlay') && iframeContent.querySelector('.vcv-loading-overlay').remove()
        }
        removeStartBlank()
        isBlank = false
        let activeLayout = settingsStorage.state('pageTemplate').get()
        if (selectedLayoutInBlank !== activeLayout) {
          settingsStorage.state('pageTemplate').set(selectedLayoutInBlank)
          workspaceIFrame.set({ type: 'reload', template: selectedLayoutInBlank })
        }
      }
      settingsStorage.state('skipBlank').set(false)
    })

    if (env('CSS_LOADING')) {
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
            iframeContent.querySelector('.vcv-loading-overlay') && iframeContent.querySelector('.vcv-loading-overlay').remove()
          }
        }
      })
    }
  }
})
