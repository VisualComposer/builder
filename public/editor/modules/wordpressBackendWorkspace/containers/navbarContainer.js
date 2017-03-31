import React from 'react'

import Logo from '../../../../resources/components/navbar/logo/logo'
import PlusControl from '../../../../resources/components/navbar/controls/plusControl'
import AddTemplateControl from '../../../../resources/components/navbar/controls/addTemplateControl'
import TreeViewControl from '../../../../resources/components/navbar/controls/treeViewControl'
import UndoRedoControl from '../../../../resources/components/navbar/controls/undoRedoControl'
import LayoutControl from '../../../../resources/components/navbar/controls/layout/layoutControl'
import SettingsButtonControl from '../../../../resources/components/navbar/controls/settingsButtonControl'
import WordPressAdminControl from '../../../../resources/components/navbar/controls/wordpressAdminControl'
import WordPressPostSaveControl from '../../../../resources/components/navbar/controls/wordpressPostSaveControl'
import NavbarSeparator from '../../../../resources/components/navbar/controls/navbarSeparator'
import Navbar from '../../../../resources/components/navbar/navbar'
import NavbarWrapper from '../../../../resources/components/navbar/navbarWrapper'

export default class NavbarContainer extends React.Component {
  render () {
    return <NavbarWrapper>
      <Navbar>
        <Logo visibility='pinned' />
        <PlusControl visibility='pinned' />
        <AddTemplateControl />
        <TreeViewControl visibility='pinned' />
        <UndoRedoControl />
        <LayoutControl visibility='pinned' />
        <SettingsButtonControl />
        <NavbarSeparator visibility='pinned' />
        <WordPressPostSaveControl visibility='pinned' />
        <WordPressAdminControl visibility='hidden' />
      </Navbar>
    </NavbarWrapper>
  }
}
