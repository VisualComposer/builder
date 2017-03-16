import {add, env, setData, getStorage} from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import Workspace from './components/workspace'

const workspaceStorage = getStorage('workspace')
add('workspace', (api) => {
  // Set Templates
  api.reply('start', () => {
    if (env('platform') === 'wordpress') {
      setData('myTemplates', window.vcvMyTemplates.map((template) => {
        template.id = template.id.toString()
        return template
      }))
    }
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
    }
  })
  let layoutHeader = document.getElementById('vcv-layout-header')
  ReactDOM.render(
    <Workspace />,
    layoutHeader
  )
})
