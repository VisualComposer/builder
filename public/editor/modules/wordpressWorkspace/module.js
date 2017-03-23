import {add, setData, getStorage} from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import WorkspaceCont from './containers/workspaceCont'

const workspaceStorage = getStorage('workspace')
add('wordpressWorkspace', (api) => {
  // Set Templates
  api.reply('start', () => {
    setData('myTemplates', window.vcvMyTemplates.map((template) => {
      template.id = template.id.toString()
      return template
    }))

    workspaceStorage.trigger('start')
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
})
