import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import Editor from './lib/editor'
import $ from 'jquery'

vcCake.add('content-layout', (api) => {
  vcCake.setData('vcv:layoutMode', 'view')
  let domContainer = $('#vcv-editor', $('#vcv-editor-iframe').get(0).contentWindow.document).get(0)
  ReactDOM.render(
    <Editor api={api} />,
    domContainer
  )
})
