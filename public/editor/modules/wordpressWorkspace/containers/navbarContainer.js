import React from 'react'

import Logo from 'public/components/navbar/logo/logo'
import PlusControl from 'public/components/navbar/controls/plusControl'
import PlusTeaserControl from 'public/components/navbar/controls/plusTeaserControl'
import AddTemplateControl from 'public/components/navbar/controls/addTemplateControl'
import TreeViewControl from 'public/components/navbar/controls/treeViewControl'
import UndoRedoControl from 'public/components/navbar/controls/undoRedoControl'
import LayoutControl from 'public/components/navbar/controls/layout/layoutControl'
import SettingsButtonControl from 'public/components/navbar/controls/settingsButtonControl'
import WordPressAdminControl from 'public/components/navbar/controls/wordpressAdminControl'
import WordPressPostSaveControl from 'public/components/navbar/controls/wordpressPostSaveControl'
import NavbarSeparator from 'public/components/navbar/controls/navbarSeparator'
import Navbar from 'public/components/navbar/navbar'
import NavbarWrapper from 'public/components/navbar/navbarWrapper'
import GoPremiumControl from 'public/components/navbar/controls/goPremiumControl'
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
