import React from 'react'
import { getService, env } from 'vc-cake'
import Logo from './logo/logo'
import PlusControl from './controls/plusControl'
import PlusTeaserControl from './controls/plusTeaserControl'
import TreeViewControl from './controls/treeViewControl'
import UndoRedoControl from './controls/undoRedoControl'
import LayoutControl from './controls/layout/layoutControl'
import SettingsButtonControl from './controls/settingsButtonControl'
import MessagesButtonControl from './controls/messagesButtonControl'
import AtarimButtonControl from './controls/atarimButtonControl'
import ViewControl from './controls/viewControl'
import Navbar from './navbar'
import NavbarWrapper from './navbarWrapper'
import GoPremiumControl from './controls/goPremiumControl'

const roleManager = getService('roleManager')

export default class NavbarContainer extends React.Component {
  render () {
    let addContentButton = null
    if (
      roleManager.can('editor_content_element_add', roleManager.defaultTrue()) ||
      roleManager.can('editor_content_template_add', roleManager.defaultTrue())
    ) {
      addContentButton = <PlusControl visibility='pinned' />
    }

    let hubControl
    if (
      roleManager.can('hub_elements_templates_blocks', roleManager.defaultTrue()) ||
      roleManager.can('hub_addons', roleManager.defaultTrue()) ||
      roleManager.can('hub_headers_footers_sidebars', roleManager.defaultTrue()) ||
      roleManager.can('hub_unsplash', roleManager.defaultTrue()) ||
      roleManager.can('hub_giphy', roleManager.defaultTrue())
    ) {
      hubControl = <PlusTeaserControl />
    }

    return (
      <NavbarWrapper wrapperRef={this.props.wrapperRef}>
        <Navbar getNavbarPosition={this.props.getNavbarPosition}>
          <GoPremiumControl visibility='save' />
          <Logo visibility='pinned' editor='frontend' />
          {addContentButton}
          <TreeViewControl visibility='pinned' />
          <UndoRedoControl isDropdown='true' />
          {window.vcvIsAtarimActive && <AtarimButtonControl/>}
          {env('VCV_FT_INSIGHTS') && <MessagesButtonControl isDropdown='true' />}
          <LayoutControl visibility='pinned' />
          {hubControl}
          <SettingsButtonControl isDropdown='true' />
          <ViewControl visibility='save' />
        </Navbar>
      </NavbarWrapper>
    )
  }
}
