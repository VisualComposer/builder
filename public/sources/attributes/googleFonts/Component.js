import React from 'react'
import Attribute from '../attribute'
import lodash from 'lodash'

import Dropdown from '../dropdown/Component'

// let webFontLoader = require('webfontloader') // update package.json
let googleFonts = require('./lib/google-fonts-set')

export default class GoogleFonts extends Attribute {
  constructor (props) {
    super(props)

    this.handleFontFamilyChange = this.handleFontFamilyChange.bind(this)
    this.handleFontStyleChange = this.handleFontStyleChange.bind(this)
    this.updateFieldValue = this.updateFieldValue.bind(this)
  }

  handleFontFamilyChange (fieldKey, value) {
    let fontStyleOptions = this.createStyleArray(value)
    this.updateFieldValue()
    this.setFieldValue({
      fontFamily: value,
      fontStyle: lodash.find(fontStyleOptions, (o) => { return o.value === 'regular' }).value
    })
  }

  handleFontStyleChange (fieldKey, value) {
    // this.setFieldValue({
    //   fontStyle: value
    // })
  }

  updateFieldValue (value) {
    this.setFieldValue({
      fontStyle: value
    })
  }

  createOptionsArray (key) {
    let newArray = []
    googleFonts.forEach((item) => {
      let arrayItem = {
        label: item[ key ],
        value: item[ key ].replace(/\s+/g, '-')
      }
      newArray.push(arrayItem)
    })
    return newArray
  }

  createStyleArray (fontFamily) {
    let newArray = []
    let variants = ''
    fontFamily = fontFamily.replace('-', ' ')

    googleFonts.forEach((item) => {
      if (item.family === fontFamily) {
        variants = item.variants
      }
    })

    variants.forEach((item) => {
      newArray.push({
        label: item,
        value: item
      })
    })

    return newArray
  }

  // loadFonts () {
  //   webFontLoader.load({
  //     google: {
  //       families: ['Droid Sans', 'Droid Serif']
  //     }
  //   })
  // }

  render () {
    let fontStyleArray = this.createStyleArray(this.state.value.fontFamily)

    let fontStyleOptions = {
      values: fontStyleArray
    }
    let fontFamilyOptions = {
      values: this.createOptionsArray('family')
    }

    // let fontStyle = lodash.find(fontStyleArray, (o) => { return o.value === 'regular' }).value

    return (
      <div className='vcv-ui-google-fonts-container'>
        <div className='vcv-ui-row vcv-ui-row-gap--md'>
          <div className='vcv-ui-col vcv-ui-col--fixed-width'>
            <div className='vcv-ui-form-group'>
              <span className='vcv-ui-form-group-heading'>
                Font Family
              </span>
              <Dropdown
                options={fontFamilyOptions}
                value={this.state.value.fontFamily}
                updater={this.handleFontFamilyChange}
                api={this.props.api}
                fieldKey={`${this.props.fieldKey}.fontFamily`}
              />
            </div>
          </div>
          <div className='vcv-ui-col vcv-ui-col--fixed-width'>
            <div className='vcv-ui-form-group'>
              <span className='vcv-ui-form-group-heading'>
                Font Style
              </span>
              <Dropdown
                options={fontStyleOptions}
                value={this.state.value.fontStyle}
                updater={this.handleFontStyleChange}
                api={this.props.api}
                fieldKey={`${this.props.fieldKey}.fontStyle`}
              />
            </div>
          </div>
        </div>
        <div className='vcv-ui-row vcv-ui-row-gap--md'>
          <div className='vcv-ui-col vcv-ui-col--fixed-width'>
            <p>{this.state.value.fontText}</p>
            <p className='vcv-ui-form-helper'>Click on preview to change it to your preferences</p>
          </div>
        </div>
      </div>
    )
  }
}
