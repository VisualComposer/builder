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
    this.setPanelWidth = this.setPanelWidth.bind(this)
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
    this.navbarPosition = position
    this.panel && this.navbar && this.setPanelWidth()
  }

  setPanelWidth () {
    switch (this.navbarPosition) {
      case 'left':
      case 'right':
        this.panel.style.width = (window.innerWidth - this.navbar.getBoundingClientRect().width) + 'px'
        break
      case 'top':
      case 'bottom':
        this.panel.style.height = (window.innerHeight - this.navbar.getBoundingClientRect().height) + 'px'
        break
      default:
        this.panel.style.width = ''
        this.panel.style.height = ''
    }
    // console.log(this.navbarPosition + ' w:' + this.panel.style.width + ' h:' + this.panel.style.height)
  }

  render () {
    const {contentStart, contentEnd, content, contentId, settings, contentStartId} = this.state

    if (env('HUB_REDESIGN')) {
      let currentSettings = workspaceSettings.get()
      if (currentSettings && currentSettings.action && currentSettings.action === 'addHub') {
        this.setPanelWidth()
        window.addEventListener('resize', this.setPanelWidth)
      } else {
        this.panel && (this.panel.style.width = '')
        window.removeEventListener('resize', this.setPanelWidth)
      }
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
