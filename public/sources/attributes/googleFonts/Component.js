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

    let fontFamily = this.createOptionsArray('family')[ 0 ].value
    let fontStyleOptions = this.createStyleArray(fontFamily)

    this.setFieldValue = {
      fontText: 'The sky was cloudless and of a deep dark blue.',
      fontFamily: fontFamily,
      fontStyle: lodash.find(fontStyleOptions, (o) => { return o.value === 'regular' }).value
    }
  }

  handleFontFamilyChange (fieldKey, value) {
    let fontStyleOptions = this.createStyleArray(value)
    this.setFieldValue({
      fontFamily: value,
      fontStyle: lodash.find(fontStyleOptions, (o) => { return o.value === 'regular' }).value
    })
  }

  handleFontStyleChange (fieldKey, value) {
    this.setFieldValue({
      fontStyle: value
    })

    // this.setFieldValue({
    //   fontFamily: '', // use this.state.value.fontFamily
    //   fontStyle: value
    // })
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

  fontFamilyOptions = {
    values: this.createOptionsArray('family')
  }

  render () {
    return (
      <div className='vcv-ui-google-fonts-container'>
        <div className='vcv-ui-row vcv-ui-row-gap--md'>
          <div className='vcv-ui-col vcv-ui-col--fixed-width'>
            <div className='vcv-ui-form-group'>
              <span className='vcv-ui-form-group-heading'>
                Font Family
              </span>
              <Dropdown
                options={this.fontFamilyOptions}
                value={this.state.fontFamily}
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
                options={this.state.fontStyleOptions}
                value={''}
                updater={this.handleFontStyleChange}
                api={this.props.api}
                fieldKey={`${this.props.fieldKey}.fontStyle`}
              />
            </div>
          </div>
        </div>
        <div className='vcv-ui-row vcv-ui-row-gap--md'>
          <div className='vcv-ui-col vcv-ui-col--fixed-width'>
            <p>{this.state.fontText}</p>
            <p className='vcv-ui-form-helper'>Click on preview to change it to your preferences</p>
          </div>
        </div>
      </div>
    )
  }
}
