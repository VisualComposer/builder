/* global expect, it */
import React from 'react'
import './__mocks__/api'

import TextBlockElement from '../textBlock/component'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const text = 'Hello jest <b>from</b> react'

  const tree = renderer
    .create(<TextBlockElement atts={{ output: text }} id={'123456789'} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
