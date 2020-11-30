/* global describe, test, expect */
import vcCake from 'vc-cake'
import '../../public/variables'
// Services & Storages
import '../../public/editor/services/utils/service.js'
import '../../public/editor/services/dataManager/service.js'
import '../../public/editor/services/document/service.js'
import '../../public/editor/services/hubElements/service.js'
import '../../public/editor/services/cook/service.js'
import '../../public/editor/services/modernAssetsStorage/service.js'
import '../../public/editor/services/api/service.js'
import '../../public/editor/services/wordpress-post-data/service'
import '../../public/config/wp-attributes'
import '../../public/editor/stores/elements/elementsStorage'
import '../../public/editor/stores/elements/elementSettings'
import '../../public/editor/modules/elementLimit/module'
import React from 'react'
import renderer from 'react-test-renderer'
// import {cleanup, fireEvent, render} from '@testing-library/react'
import { setupCake } from '../../public/components/editorInit/setupCake'
import NavbarContainer from '../../public/components/navbar/navbarContainer'
// import Editor from '../../public/editor/modules/layout/lib/editor'

describe('Tests editor navbar', () => {
  // const navbarContainer = render(
  //   <NavbarContainer wrapperRef={(navbar) => { this.navbar = navbar }} getNavbarPosition={() => { return true}} />
  // )
  test('Navbar render', () => {
    // setupCake()
    vcCake.env('platform', 'wordpress').start(()=>{})
    vcCake.add('contentLayout', (api) => {
      let navbarRef
      const navbar = renderer.create(
        <NavbarContainer getNavbarPosition={() => {}} wrapperRef={(navbar) => { navbarRef = navbar }} />
      )
      let tree = navbar.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})