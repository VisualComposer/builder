import React from 'react'

import Logo from './logo/logo'
import PlusControl from './controls/plusControl'
import PlusTeaserControl from './controls/plusTeaserControl'
import AddTemplateControl from './controls/addTemplateControl'
import TreeViewControl from './controls/treeViewControl'
import UndoRedoControl from './controls/undoRedoControl'
import LayoutControl from './controls/layout/layoutControl'
import SettingsButtonControl from './controls/settingsButtonControl'
import WordPressAdminControl from './controls/wordpressAdminControl'
import WordPressPostSaveControl from './controls/wordpressPostSaveControl'
import NavbarSeparator from './controls/navbarSeparator'
import Navbar from './navbar'
import NavbarWrapper from './navbarWrapper'
import GoPremiumControl from './controls/goPremiumControl'
import { getStorage } from 'vc-cake'

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
    this.setState({ locked: !!data })
  }

  render () {
    const { locked } = this.state

    return <NavbarWrapper wrapperRef={this.props.wrapperRef}>
      <Navbar locked={locked} draggable getNavbarPosition={this.props.getNavbarPosition}>
        <GoPremiumControl visibility='hidden' />
        <Logo visibility='pinned' editor='frontend' />
        <PlusControl visibility='pinned' />
        <AddTemplateControl />
        <TreeViewControl visibility='pinned' />
        <UndoRedoControl />
        <LayoutControl visibility='pinned' />
        <SettingsButtonControl />
        <PlusTeaserControl />
        <NavbarSeparator visibility='pinned' />
        <WordPressPostSaveControl visibility='pinned' />
        <WordPressAdminControl visibility='hidden' />
      </Navbar>
    </NavbarWrapper>
  }
}
