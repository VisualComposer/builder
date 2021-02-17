import React from 'react'

import PanelsContainer from '../panels/panelsContainer'
import NavbarContainer from '../navbar/navbarContainer'
import Workspace from './workspace'
import { getStorage } from 'vc-cake'

const workspace = getStorage('workspace')
const workspaceSettings = workspace.state('settings')

export default class WorkspaceCont extends React.Component {
  vcvLayout = document.getElementById('vcv-layout')

  constructor (props) {
    super(props)
    this.state = {
      content: false
    }
    this.setContent = this.setContent.bind(this)
    this.getNavbarPosition = this.getNavbarPosition.bind(this)
    this.setPanelSize = this.setPanelSize.bind(this)
    this.resetPanelSize = this.resetPanelSize.bind(this)
    this.updatePanel = this.updatePanel.bind(this)
  }

  componentDidMount () {
    workspace.state('content').onChange(this.setContent)
  }

  componentWillUnmount () {
    workspace.state('content').ignoreChange(this.setContent)
  }

  setContent (value) {
    const content = value || false
    this.setState({
      content: content
    })

    if (content !== 'addElement' && content !== 'addTemplate') {
      workspace.state('isRemoveStateActive').set(false)
    }

    if (content === 'addHubElement') {
      this.vcvLayout.classList.add('vcv-content-full-size')
    } else if (this.vcvLayout.classList.contains('vcv-content-full-size')) {
      this.vcvLayout.classList.remove('vcv-content-full-size')
    }
  }

  getNavbarPosition (position) {
    this.positionChanged = this.navbarPosition !== position
    this.navbarPosition = position
    this.panel && this.navbar && this.positionChanged && this.updatePanel()
  }

  resetPanelSize () {
    if (this.panel) {
      this.panel.style.minWidth = ''
      this.panel.style.minHeight = ''
    }
  }

  setPanelSize () {
    switch (this.navbarPosition) {
      case 'left':
      case 'right':
        this.panel.style.minWidth = (window.innerWidth - this.navbar.getBoundingClientRect().width) + 'px'
        this.panel.style.minHeight = ''
        break
      case 'top':
      case 'bottom':
        this.panel.style.minHeight = (window.innerHeight - this.navbar.getBoundingClientRect().height) + 'px'
        this.panel.style.minWidth = ''
        break
      default:
        this.resetPanelSize()
    }
  }

  updatePanel () {
    const currentSettings = workspaceSettings.get()
    if (currentSettings && currentSettings.action && currentSettings.action === 'addHub') {
      this.setPanelSize()
      window.addEventListener('resize', this.setPanelSize)
    } else {
      this.resetPanelSize()
      window.removeEventListener('resize', this.setPanelSize)
    }
  }

  render () {
    const { content } = this.state
    this.updatePanel()

    return (
      <Workspace hasContent={!!content}>
        <NavbarContainer getNavbarPosition={this.getNavbarPosition} wrapperRef={(navbar) => { this.navbar = navbar }} />
        <PanelsContainer
          content={content}
          wrapperRef={(panel) => {
            this.panel = panel
          }}
        />
      </Workspace>
    )
  }
}
