import React from 'react'

import Logo from '../../../../resources/components/navbar/logo/logo'
import PlusControl from '../../../../resources/components/navbar/controls/plusControl'
import AddTemplateControl from '../../../../resources/components/navbar/controls/addTemplateControl'
import TreeViewControl from '../../../../resources/components/navbar/controls/treeViewControl'
import UndoRedoControl from '../../../../resources/components/navbar/controls/undoRedoControl'
import LayoutControl from '../../../../resources/components/navbar/controls/layout/layoutControl'
import SettingsButtonControl from '../../../../resources/components/navbar/controls/settingsButtonControl'
import Navbar from '../../../../resources/components/navbar/navbar'
import {getStorage} from 'vc-cake'

const workspaceStorage = getStorage('workspace')
const contentEndState = workspaceStorage.state('contentEnd')

export default class NavbarContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      locked: false
    }
    this.updateLockedState = this.updateLockedState.bind(this)
  }
  componentDidMount () {
    contentEndState.onChange(this.updateLockedState)
  }
  componentWillUnmount () {
    contentEndState.ignoreChange(this.updateLockedState)
  }
  updateLockedState (data) {
    this.setState({locked: !!data})
  }
  render () {
    return <Navbar>
      <Logo visibility='pinned' />
      <PlusControl visibility='pinned' />
      <AddTemplateControl />
      <TreeViewControl visibility='pinned' />
      <UndoRedoControl />
      <LayoutControl visibility='pinned' />
      <SettingsButtonControl />
    </Navbar>
  }
}
