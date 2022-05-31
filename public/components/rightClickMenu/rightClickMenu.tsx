import React from 'react'
import ReactDOM from 'react-dom'
import { getStorage, getService, env } from 'vc-cake'
import MenuDropdown from './menuDropdown'
import { disableScroll, enableScroll } from '../../tools/disableScroll'

const workspaceStorage = getStorage('workspace')
const layoutStorage = getStorage('layout')
const cook = getService('cook')
const roleManager = getService('roleManager')

const RightClickMenu = () => {
  let iframeOverlay = document.querySelector('#vcv-editor-iframe-overlay')
  let menuWrapper: HTMLDivElement
  let iframeWindow: Window | null

  const createMenuWrapper = () => {
    menuWrapper = document.createElement('div')
    menuWrapper.classList.add('vcv-ui-right-click-menu-wrapper')
    iframeOverlay && iframeOverlay.appendChild(menuWrapper)
  }


  const unmountMenuComponent = () => {
    const controlsState = layoutStorage.state('interactWithControls').get()
    if (controlsState && controlsState.vcControlIsPermanent) {
      return
    }
    iframeWindow?.document.removeEventListener('click', unmountMenuComponent)
    window.document.removeEventListener('click', unmountMenuComponent)

    workspaceStorage.state('userInteractWith').set(null)

    enableScroll(iframeWindow)

    ReactDOM.unmountComponentAtNode(menuWrapper)
    layoutStorage.state('rightClickMenuActive').set(false)
  }

  const handleRightClick = (e: MouseEvent) => {
    const targetElement = e.target as HTMLElement
    targetElement.blur()

    iframeWindow?.document.addEventListener('click', unmountMenuComponent)
    window.document.addEventListener('click', unmountMenuComponent)
    workspaceStorage.state('userInteractWith').set(null)

    let id = targetElement.getAttribute('data-vcv-element')

    if (!id) {
      const closest = targetElement.closest('[data-vcv-element]')
      if (closest) {
        id = closest.getAttribute('data-vcv-element')
      }
    }
    const element = cook.getById(id)
    const isElementLocked = env('VCV_ADDON_ROLE_MANAGER_ENABLED') && element?.get('metaIsElementLocked') && !roleManager?.can('editor_settings_element_lock', roleManager?.defaultAdmin())

    if (id && !isElementLocked) {
      e.preventDefault()

      workspaceStorage.state('userInteractWith').set(id)
      disableScroll(iframeWindow)
      layoutStorage.state('rightClickMenuActive').set(true)
      ReactDOM.render(<MenuDropdown id={id} position={{ top: e.clientY, left: e.clientX }} />, menuWrapper)

      return false
    }
  }

  const init = () => {
    const iframe = document.getElementById('vcv-editor-iframe') as HTMLIFrameElement
    iframeWindow = iframe.contentWindow
    if (iframe && iframeWindow?.document) {
      iframeWindow.document.addEventListener('contextmenu', handleRightClick)
    }
  }

  createMenuWrapper()
  init()
}

export default RightClickMenu
