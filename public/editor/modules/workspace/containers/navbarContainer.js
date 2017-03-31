import React from 'react'

import Logo from '../../../../resources/components/navbar/logo/logo'
import PlusControl from '../../../../resources/components/navbar/controls/plusControl'
import AddTemplateControl from '../../../../resources/components/navbar/controls/addTemplateControl'
import TreeViewControl from '../../../../resources/components/navbar/controls/treeViewControl'
import UndoRedoControl from '../../../../resources/components/navbar/controls/undoRedoControl'
import LayoutControl from '../../../../resources/components/navbar/controls/layout/layoutControl'
import SettingsButtonControl from '../../../../resources/components/navbar/controls/settingsButtonControl'
import SaveControl from '../../../../resources/components/navbar/controls/saveControl'
import NavbarSeparator from '../../../../resources/components/navbar/controls/navbarSeparator'
import Navbar from '../../../../resources/components/navbar/navbar'
import NavbarWrapper from '../../../../resources/components/navbar/navbarWrapper'

export default class NavbarContainer extends React.Component {
  render () {
    return <NavbarWrapper>
      <Navbar>
        <Logo visibility='pinned' name='Visual Composer' />
        <PlusControl visibility='pinned' name='Add Element' />
        <AddTemplateControl />
        <TreeViewControl visibility='pinned' />
        <UndoRedoControl />
        <LayoutControl />
        <SettingsButtonControl />
        <NavbarSeparator visibility='pinned' />
        <SaveControl visibility='pinned' />
      </Navbar>
    </NavbarWrapper>
  }
}
