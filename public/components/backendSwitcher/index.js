import ReactDOM from 'react-dom'
import React from 'react'
import FrontendClassicSwitcher from './lib/frontendClassicSwitcher'

export default () => {
  const titleDiv = document.querySelector('div#titlediv')
  const gutenbergEditor = document.getElementById('editor')
  const switcherContainer = document.createElement('div')
  switcherContainer.className = 'vcv-wpbackend-switcher-container'
  let render = false
  const renderSwitcher = (switcherContainer) => {
    ReactDOM.render(
      <FrontendClassicSwitcher />,
      switcherContainer
    )
  }
  if (titleDiv) {
    titleDiv.parentNode.insertBefore(switcherContainer, titleDiv.nextSibling)
    render = true
  } else if (gutenbergEditor) {
    let timeout = (window.WPML_core) ? 2500 : 1
    setTimeout(() => {
      const gutenbergEditorHeader = gutenbergEditor ? gutenbergEditor.querySelector('.edit-post-header-toolbar') : null
      if (gutenbergEditorHeader) {
        gutenbergEditorHeader.appendChild(switcherContainer)
        renderSwitcher(switcherContainer)
      }
    }, timeout)
  } else {
    let postBodyContent = document.getElementById('post-body-content')
    if (postBodyContent) {
      if (postBodyContent.firstChild) {
        postBodyContent.insertBefore(switcherContainer, postBodyContent.firstChild)
      } else {
        postBodyContent.appendChild(switcherContainer)
      }
      render = true
    }
  }
  if (render) {
    renderSwitcher(switcherContainer)
  }
}
