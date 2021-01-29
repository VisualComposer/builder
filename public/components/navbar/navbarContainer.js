import React from 'react'
import { env } from 'vc-cake'
import Logo from './logo/logo'
import PlusControl from './controls/plusControl'
import PlusTeaserControl from './controls/plusTeaserControl'
import TreeViewControl from './controls/treeViewControl'
import UndoRedoControl from './controls/undoRedoControl'
import LayoutControl from './controls/layout/layoutControl'
import SettingsButtonControl from './controls/settingsButtonControl'
import InsightsButtonControl from './controls/insightsButtonControl'
import WordPressAdminControl from './controls/wordpressAdminControl'
import WordPressPostSaveControl from './controls/wordpressPostSaveControl'
import NavbarSeparator from './controls/navbarSeparator'
import Navbar from './navbar'
import NavbarWrapper from './navbarWrapper'
import GoPremiumControl from './controls/goPremiumControl'

export default class NavbarContainer extends React.Component {
  render () {
    return (
      <NavbarWrapper wrapperRef={this.props.wrapperRef}>
        <Navbar draggable getNavbarPosition={this.props.getNavbarPosition}>
          <GoPremiumControl visibility='hidden' />
          <Logo visibility='pinned' editor='frontend' />
          <PlusControl visibility='pinned' />
          <TreeViewControl visibility='pinned' />
          <UndoRedoControl />
          {env('VCV_FT_INSIGHTS') ? <InsightsButtonControl /> : null}
          <LayoutControl visibility='pinned' />
          <PlusTeaserControl />
          <SettingsButtonControl />
          <NavbarSeparator visibility='pinned' />
          <WordPressPostSaveControl visibility='pinned' />
          <WordPressAdminControl visibility='hidden' />
        </Navbar>
      </NavbarWrapper>
    )
  }
}
