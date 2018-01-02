import React from 'react'

import PanelsContainer from './panelsContainer'
import NavbarContainer from './navbarContainer'
import Workspace from '../../../../resources/components/workspace'
import {getStorage, env} from 'vc-cake'

const workspace = getStorage('workspace')
const workspaceSettings = workspace.state('settings')

export default class WorkspaceCont extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      contentStart: false,
      contentEnd: false,
      content: false,
      settings: {}
    }
    this.setContent = this.setContent.bind(this)
    this.setContentStart = this.setContentStart.bind(this)
    this.setContentEnd = this.setContentEnd.bind(this)
    this.getNavbarPosition = this.getNavbarPosition.bind(this)
    this.setPanelSize = this.setPanelSize.bind(this)
    this.resetPanelSize = this.resetPanelSize.bind(this)
    this.updatePanel = this.updatePanel.bind(this)
  }
  componentDidMount () {
    if (env('NAVBAR_SINGLE_CONTENT')) {
      workspace.state('content').onChange(this.setContent)
      return
    }
    workspace.state('contentStart').onChange(this.setContentStart)
    workspace.state('contentEnd').onChange(this.setContentEnd)
  }
  componentWillUnmount () {
    if (env('NAVBAR_SINGLE_CONTENT')) {
      workspace.state('content').ignoreChange(this.setContent)
      return
    }
    workspace.state('contentStart').ignoreChange(this.setContentStart)
    workspace.state('contentEnd').ignoreChange(this.setContentEnd)
  }
  setContentEnd (value) {
    const contentEnd = value || false
    this.setState({contentEnd: contentEnd, settings: workspace.state('settings').get() || {}})
  }
  setContentStart (value, id) {
    this.setState({
      contentStart: value || false,
      contentStartId: id || ''
    })
  }
  setContent (value, id) {
    const content = value || false
    this.setState({
      content: content,
      contentId: id || '',
      settings: workspace.state('settings').get() || {}
    })
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
        break
      case 'top':
      case 'bottom':
        this.panel.style.minHeight = (window.innerHeight - this.navbar.getBoundingClientRect().height) + 'px'
        break
      default:
        this.resetPanelSize()
    }
  }

  updatePanel () {
    let currentSettings = workspaceSettings.get()
    if (currentSettings && currentSettings.action && currentSettings.action === 'addHub') {
      this.setPanelSize()
      window.addEventListener('resize', this.setPanelSize)
    } else {
      this.resetPanelSize()
      window.removeEventListener('resize', this.setPanelSize)
    }
  }

  render () {
    const {contentStart, contentEnd, content, contentId, settings, contentStartId} = this.state

    if (env('HUB_REDESIGN')) {
      this.updatePanel()
    }

    if (env('NAVBAR_SINGLE_CONTENT')) {
      if (env('HUB_REDESIGN')) {
        return (
          <Workspace content={!!content}>
            <NavbarContainer getNavbarPosition={this.getNavbarPosition} wrapperRef={(navbar) => { this.navbar = navbar }} />
            <PanelsContainer
              content={content}
              settings={settings}
              contentId={contentId}
              wrapperRef={(panel) => {
                this.panel = panel
              }}
            />
          </Workspace>
        )
      }
      return (
        <Workspace content={!!content}>
          <NavbarContainer />
          <PanelsContainer
            content={content}
            settings={settings}
            contentId={contentId}
          />
        </Workspace>
      )
    }

    return (
      <Workspace contentStart={!!contentStart} contentEnd={!!contentEnd}>
        <NavbarContainer />
        <PanelsContainer
          start={contentStart}
          end={contentEnd}
          settings={settings}
          contentStartId={contentStartId}
        />
      </Workspace>
    )
  }
}
