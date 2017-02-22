import {add, env, setData} from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import Workspace from './components/workspace'

add('workspace', (api) => {
  // Set Templates
  api.reply('start', () => {
    if (env('platform') === 'wordpress') {
      setData('myTemplates', window.vcvMyTemplates.map((template) => {
        template.id = template.id.toString()
        return template
      }))
    }
  })
  let layoutHeader = document.getElementById('vcv-layout-header')
  ReactDOM.render(
    <Workspace />,
    layoutHeader
  )
})
