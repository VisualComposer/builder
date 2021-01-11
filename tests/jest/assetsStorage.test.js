/* global describe, test, expect */
import vcCake from 'vc-cake'
import '../../public/variables'

// Services & Storages
import '../../public/editor/services/dataManager/service.js'
import '../../public/editor/services/utils/service.js'
import '../../public/editor/services/document/service.js'
import '../../public/editor/services/cook/service.js'
import '../../public/editor/services/modernAssetsStorage/service.js'
import '../../public/editor/services/api/service.js'
import '../../public/config/wp-attributes'
import '../../public/editor/stores/elements/elementsStorage'
import '../../public/editor/stores/elements/elementSettings'
import '../../public/editor/modules/elementLimit/module'

// Elements
import '../../elements/row/row/index'
import '../../elements/column/column/index'
import '../../elements/basicButton/basicButton/index'


// EnzymeJS
import React from 'react'
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import ButtonElement from '../../elements/basicButton/basicButton/component'

configure({ adapter: new Adapter() });

jest.useFakeTimers()

describe('Test assetsStorage', () => {
  const elementsStorage = vcCake.getStorage('elements')
  const assetsStorage = vcCake.getStorage('assets')
  const documentManager = vcCake.getService('document')
  const cook = vcCake.getService('cook')

  const id = '12345678'
  const buttonColor = 'rgb(11, 90, 224)'
  const buttonText = 'Hello World'
  let assetsOptions = {}

  vcCake.env('VCV_DEBUG', true)
  vcCake.start(() => {
    test('ElementStorage add Basic Button', () => {
      elementsStorage.trigger('add', { tag: 'basicButton', id: id })
      const basicButton = documentManager.get(id)
      expect(basicButton.id).toBe(id)
      const buttonWrapper = mount(<ButtonElement atts={{...basicButton}} id='123456789' />)
      const button = buttonWrapper.find('.vce-button--style-basic')
      expect(buttonWrapper.exists()).toBe(true)
      expect(buttonWrapper.prop('atts').color).toBe('#fff')
      expect(button.text()).toBe('Apply Now')
    })
    test('ElementsStorage update Basic Button color', () => {
      const basicButton = cook.get(documentManager.get(id))
      basicButton.set('color', buttonColor)
      basicButton.set('buttonText', buttonText)
      const basicButtonData = basicButton.toJS()
      elementsStorage.trigger('update', id, basicButtonData)
      elementsStorage.on(`element:${id}`, (data, source, options) => {
        assetsOptions = options
      })
      jest.runAllTimers()
      const element = documentManager.get(id)
      expect(element.color).toBe(buttonColor)
      const buttonWrapper = mount(<ButtonElement atts={{...element}} id='123456789' />)
      const button = buttonWrapper.find('.vce-button--style-basic')
      expect(buttonWrapper.exists()).toBe(true)
      expect(buttonWrapper.prop('atts').color).toBe(buttonColor)
      expect(button.text()).toBe(buttonText)
    })
    test('Assets Storage update Basic Button color assets', () => {
      // const options = {
      //   changedAttribute: 'color'
      // }
      assetsStorage.trigger('updateElement', id, assetsOptions)
      // console.log('assetsStorage jobs',assetsStorage.state('jobs').get())
    })
  })
})
