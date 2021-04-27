import React from 'react'
import { getService, env } from 'vc-cake'
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

const roleManager = getService('roleManager')

export default class NavbarContainer extends React.Component {
  render () {
    let hubControl
    if (
      (roleManager.can('hub_elements_templates_blocks', roleManager.defaultTrue())) ||
      (roleManager.can('hub_addons', roleManager.defaultTrue())) ||
      (roleManager.can('hub_headers_footers_sidebars', roleManager.defaultTrue())) ||
      (roleManager.can('hub_unsplash', roleManager.defaultTrue())) ||
      (roleManager.can('hub_giphy', roleManager.defaultTrue()))
    ) {
      hubControl = <PlusTeaserControl />
    }
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
          {hubControl}
          <SettingsButtonControl />
          <NavbarSeparator visibility='pinned' />
          <WordPressPostSaveControl visibility='pinned' />
          <WordPressAdminControl visibility='hidden' />
        </Navbar>
      </NavbarWrapper>
    )
  }
}
