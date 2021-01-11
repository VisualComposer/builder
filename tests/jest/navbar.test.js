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

// React and Enzyme
import React from 'react'
import renderer from 'react-test-renderer'
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'

// Navbar Component
import NavbarContainer from '../../public/components/navbar/navbarContainer'

configure({ adapter: new Adapter() });

describe('Tests editor navbar', () => {
  vcCake.env('platform', 'wordpress').start(() => {
    test('Create navbar component snapshot', () => {
      vcCake.add('contentLayout', (api) => {
        let navbarRef
        const navbar = renderer.create(
          <NavbarContainer getNavbarPosition={() => {}} wrapperRef={(navbar) => { navbarRef = navbar }} />
        )
        let tree = navbar.toJSON()
        expect(tree).toMatchSnapshot()
      })
    })
    test('Render navbar component', () => {
      let navbarRef
      const navbarContainer = mount(<NavbarContainer getNavbarPosition={() => {}} wrapperRef={(navbar) => { navbarRef = navbar }} />)
      expect(navbarContainer.exists()).toBe(true)
      const navbar = navbarContainer.find('.vcv-ui-navbar')
      expect(navbar.exists()).toBe(true)
      const addElementControl = navbar.find('.vcv-ui-navbar-control[data-vcv-guide-helper="plus-control"]')
      expect(addElementControl.exists()).toBe(true)
    })
  })
})