import {add, getStorage} from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import WorkspaceCont from './containers/workspaceCont'
import StartBlankPanel from 'public/resources/components/startBlank/StartBlankPanel'

const workspaceStorage = getStorage('workspace')
const wordpressDataStorage = getStorage('wordpressData')
const elementsStorage = getStorage('elements')
add('wordpressUpdateWorkspace', (api) => {
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
  const layoutHeader = document.getElementById('vcv-wpbackend-layout-header')
  const layout = document.getElementById('vcv-layout')
  ReactDOM.render(
    <WorkspaceCont layout={layout} layoutHeader={layoutHeader} />,
    layoutHeader
  )
  workspaceStorage.state('lastAction').set(false)
  // Start blank overlay
  let iframeContent = document.getElementById('vcv-layout-iframe-content')

  const removeStartBlank = () => {
    layout && layout.classList.remove('vcv-layout-start-blank--active')
    ReactDOM.unmountComponentAtNode(iframeContent)
  }
  const addStartBlank = () => {
    layout && layout.classList.add('vcv-layout-start-blank--active')
    ReactDOM.render(
      <StartBlankPanel unmountStartBlank={removeStartBlank} />,
      iframeContent
    )
  }

  elementsStorage.state('document').onChange((data) => {
    if (data.length === 0) {
      addStartBlank()
    } else {
      iframeContent.querySelector('.vcv-loading-overlay') && iframeContent.querySelector('.vcv-loading-overlay').remove()
      removeStartBlank()
    }
  })
})
