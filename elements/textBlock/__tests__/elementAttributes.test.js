/* global describe, it, expect */
import React from 'react'
import './__mocks__/api'
import TextBlockElement from '../textBlock/component'
import { shallow } from 'enzyme'

describe('Test component attributes', () => {
  it('the element should have text and id', () => {
    const text = 'Hello jest from react'
    const id = '1234'
    const customClass = 'jestTestClass'
    const app = shallow(<TextBlockElement atts={{ output: text, customClass: customClass }} id={id} />)
    expect(app.contains(text)).toBe(true)
    expect(app.hasClass(customClass)).toBe(true)
    expect(app.find(`#el-${id}`).length).toBe(1)
  })
})
