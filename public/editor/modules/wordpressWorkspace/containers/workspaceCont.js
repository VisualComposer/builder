import React from 'react'

import PanelsContainer from './panelsContainer'
import NavbarContainer from './navbarContainer'
import Workspace from '../../../../resources/components/workspace'
import {getStorage, env} from 'vc-cake'

const workspace = getStorage('workspace')

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

  render () {
    const {contentStart, contentEnd, content, contentId, settings, contentStartId} = this.state

    if (env('NAVBAR_SINGLE_CONTENT')) {
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
