/* global expect, it */
import vcCake from 'vc-cake'

import '../../public/variables'
import '../../public/editor/services/utils/service.js'
import '../../public/editor/services/dataManager/service.js'
import '../../public/editor/services/document/service.js'
import '../../public/editor/services/dataProcessor/service.js'
import '../../public/editor/services/hubElements/service.js'
import '../../public/editor/services/cook/service.js'
import '../../public/editor/services/modernAssetsStorage/service.js'
import '../../public/editor/services/api/service.js'
import '../../public/editor/services/wordpress-post-data/service'

import '../../public/config/wp-attributes'

// import '../../public/editor/stores/shortcodesAssets/storage'
import '../../public/editor/stores/elements/elementSettings'

import '../../public/editor/modules/elementLimit/module'

import '../../public/tools/updateHtmlWithServer'


import React from 'react'
import renderer from 'react-test-renderer'
// import './__mocks__/api'

import ButtonElement from '../../elements/basicButton/basicButton/component'


describe('Tests Basic Button element render', () => {
  test('Basic Button render', () => {
    const text = 'Hello jest from react'

    vcCake.env('platform', 'jest').start(()=>{})
    const tree = renderer
      .create(<ButtonElement atts={{ buttonText: text }} id='123456789' />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})

