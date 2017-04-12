import {add, getStorage, env} from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import WorkspaceCont from './containers/workspaceCont'
import StartBlankPanel from '../../../resources/components/startBlank/startBlankPanel'

const localStorage = getStorage('localStorage')
const workspaceStorage = getStorage('workspace')
const elementsStorage = getStorage('elements')
add('workspace', (api) => {
  // Set Templates
  api.reply('start', () => {
    localStorage.trigger('start')
  })
  workspaceStorage.state('settings').onChange((settings) => {
    if (!settings || !settings.action) {
      workspaceStorage.state('contentEnd').set(false)
      return
    }
    if (settings.action === 'add') {
      workspaceStorage.state('contentEnd').set('addElement')
    } else if (settings.action === 'edit') {
      workspaceStorage.state('contentEnd').set('editElement')
    } else if (settings.action === 'addTemplate') {
      workspaceStorage.state('contentEnd').set('addTemplate')
    }
  })
  let layoutHeader = document.getElementById('vcv-layout-header')
  ReactDOM.render(
    <WorkspaceCont />,
    layoutHeader
  )

  if (env('FEATURE_START_BLANK')) {
    // Start blank overlay
    let iframeContent = document.getElementById('vcv-layout-iframe-content')

    const removeStartBlank = () => {
      ReactDOM.unmountComponentAtNode(iframeContent)
    }
    const addStartBlank = () => {
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
  }
})
