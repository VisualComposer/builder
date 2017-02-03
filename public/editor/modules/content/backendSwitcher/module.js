import vcCake from 'vc-cake'
import ReactDOM from 'react-dom'
import React from 'react'

import BackendSwitcher from './lib/helpers/backendSwitcher/component'

if (vcCake.env('FEATURE_WPBACKEND')) {
  vcCake.add('backendSwitcher', (api) => {
    let titleDiv = document.querySelector('div#titlediv')
    let switcherContainer = document.createElement('div')
    switcherContainer.className = 'vcv-wpbackend-switcher-container'

    if (titleDiv) {
      titleDiv.parentNode.insertBefore(switcherContainer, titleDiv.nextSibling)
    } else {
      let postBodyContent = document.getElementById('post-body-content')
      if (postBodyContent && postBodyContent.firstChild) {
        postBodyContent.insertBefore(switcherContainer, postBodyContent.firstChild)
      } else {
        postBodyContent.appendChild(switcherContainer)
      }
    }

    ReactDOM.render(
      <BackendSwitcher />,
      switcherContainer
    )
  })
}
