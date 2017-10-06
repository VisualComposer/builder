import { add, setData, getStorage, env } from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import WorkspaceCont from './containers/workspaceCont'
import StartBlankPanel from '../../../resources/components/startBlank/StartBlankPanel'

const workspaceStorage = getStorage('workspace')
const wordpressDataStorage = getStorage('wordpressData')
const elementsStorage = getStorage('elements')
const assetsStorage = getStorage('assets')
add('wordpressWorkspace', (api) => {
  // Set Templates
  api.reply('start', () => {
    setData('myTemplates', window.VCV_MY_TEMPLATES())

    wordpressDataStorage.trigger('start')
  })
  workspaceStorage.state('settings').onChange((settings) => {
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
  let layoutHeader = document.getElementById('vcv-layout-header')
  ReactDOM.render(
    <WorkspaceCont />,
    layoutHeader
  )

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
      if (!env('CSS_LOADING')) {
        iframeContent.querySelector('.vcv-loading-overlay') && iframeContent.querySelector('.vcv-loading-overlay').remove()
      }
      removeStartBlank()
    }
  })
  if (env('CSS_LOADING')) {
    assetsStorage.state('jobs').onChange((data) => {
      if (data && !data.jobs) {
        iframeContent.querySelector('.vcv-loading-overlay') && iframeContent.querySelector('.vcv-loading-overlay').remove()
      }
    })
  }
})
