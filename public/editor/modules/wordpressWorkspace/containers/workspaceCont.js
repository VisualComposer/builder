import React from 'react'

import PanelsContainer from './panelsContainer'
import NavbarContainer from './navbarContainer'
import Workspace from '../../../../resources/components/workspace'
import {getStorage} from 'vc-cake'

const workspace = getStorage('workspace')

export default class WorkspaceCont extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      contentStart: false,
      contentEnd: false,
      settings: {}
    }
    this.setContentStart = this.setContentStart.bind(this)
    this.setContentEnd = this.setContentEnd.bind(this)
  }
  componentDidMount () {
    workspace.state('contentStart').onChange(this.setContentStart)
    workspace.state('contentEnd').onChange(this.setContentEnd)
  }
  componentWillUnmount () {
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

  render () {
    const {contentStart, contentEnd, settings, contentStartId} = this.state

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
