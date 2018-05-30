import React from 'react'

import Logo from 'public/resources/components/navbar/logo/logo'
import PlusControl from 'public/resources/components/navbar/controls/plusControl'
import PlusTeaserControl from 'public/resources/components/navbar/controls/plusTeaserControl'
import AddTemplateControl from 'public/resources/components/navbar/controls/addTemplateControl'
import TreeViewControl from 'public/resources/components/navbar/controls/treeViewControl'
import UndoRedoControl from 'public/resources/components/navbar/controls/undoRedoControl'
import LayoutControl from 'public/resources/components/navbar/controls/layout/layoutControl'
import SettingsButtonControl from 'public/resources/components/navbar/controls/settingsButtonControl'
import WordPressAdminControl from 'public/resources/components/navbar/controls/wordpressAdminControl'
import WordPressPostSaveControl from 'public/resources/components/navbar/controls/wordpressPostSaveControl'
import NavbarSeparator from 'public/resources/components/navbar/controls/navbarSeparator'
import Navbar from 'public/resources/components/navbar/navbar'
import NavbarWrapper from 'public/resources/components/navbar/navbarWrapper'
import GoPremiumControl from 'public/resources/components/navbar/controls/goPremiumControl'
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
