import React from 'react'
import ReactDOM from 'react-dom'
import { getStorage } from 'vc-cake'
import MenuDropdown from './menuDropdown'
import { disableScroll, enableScroll } from 'public/tools/disableScroll'

const workspaceStorage = getStorage('workspace')

export default class RightClickMenu extends React.Component {
  constructor (props) {
    super(props)
    this.iframeOverlay = document.querySelector('#vcv-editor-iframe-overlay')

    this.handleRightClick = this.handleRightClick.bind(this)
    this.unmountMenuComponent = this.unmountMenuComponent.bind(this)

    this.createMenuWrapper()
  }

  createMenuWrapper () {
    this.menuWrapper = document.createElement('div')
    this.menuWrapper.classList.add('vcv-ui-right-click-menu-wrapper')
    this.iframeOverlay.appendChild(this.menuWrapper)
  }

  unmountMenuComponent () {
    this.iframeWindow.document.removeEventListener('click', this.unmountMenuComponent)
    window.document.removeEventListener('click', this.unmountMenuComponent)

    workspaceStorage.state('userInteractWith').set(null)

    enableScroll(this.iframeWindow)

    ReactDOM.unmountComponentAtNode(this.menuWrapper)
  }

  handleRightClick (e) {
    const targetElement = e.target
    let id = targetElement.getAttribute('data-vcv-element')
    const currentElement = workspaceStorage.state('userInteractWith').get()
    if (id === currentElement) {
      this.unmountMenuComponent()
      return false
    }
    this.iframeWindow.document.addEventListener('click', this.unmountMenuComponent)
    window.document.addEventListener('click', this.unmountMenuComponent)
    workspaceStorage.state('userInteractWith').set(null)

    if (!id) {
      const closest = targetElement.closest('[data-vcv-element]')
      if (closest) {
        id = closest.getAttribute('data-vcv-element')
      }
    }

    if (id) {
      e.preventDefault()

      workspaceStorage.state('userInteractWith').set(id)

      disableScroll(this.iframeWindow)

      ReactDOM.render(<MenuDropdown id={id} position={{ top: e.clientY, left: e.clientX }} />, this.menuWrapper)

      return false
    }
  }

  init () {
    const iframe = document.getElementById('vcv-editor-iframe')
    this.iframeWindow = iframe.contentWindow
    if (iframe && this.iframeWindow.document) {
      this.iframeWindow.document.addEventListener('contextmenu', this.handleRightClick)
    }
  }
}
