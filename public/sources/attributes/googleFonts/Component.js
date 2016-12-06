import React from 'react'
import Attribute from '../attribute'
import lodash from 'lodash'
import './css/styles.less'

import Dropdown from '../dropdown/Component'

let webFontLoader = require('webfontloader')
let googleFonts = require('./lib/google-fonts-set')

export default class GoogleFonts extends Attribute {
  static fontWeight = {
    100: 'Thin',
    200: 'Extra Light',
    300: 'Light',
    400: 'Normal',
    500: 'Medium',
    600: 'Semi Bold',
    700: 'Bold',
    800: 'Extra Bold',
    900: 'Black'
  }
  static defaultFontOptions = {
    fontText: 'The sky was cloudless and of a deep dark blue.',
    fontFamily: 'Abril Fatface',
    fontStyle: {
      weight: '',
      style: 'regular'
    },
    loading: ''
  }

  constructor (props) {
    super(props)
    this.handleFontFamilyChange = this.handleFontFamilyChange.bind(this)
    this.handleFontStyleChange = this.handleFontStyleChange.bind(this)
    this.createFieldValue = this.createFieldValue.bind(this)
    this.updateFieldValue = this.updateFieldValue.bind(this)
  }

  componentWillMount () {
    let mergedValue = lodash.merge(GoogleFonts.defaultFontOptions, this.state.value)
    this.loadFonts(mergedValue.fontFamily, mergedValue.fontStyle, mergedValue.fontText)
  }

  handleFontFamilyChange (fieldKey, value) {
    let fontStyleOptions = this.createStyleArray(value)
    let regularStyle = lodash.find(fontStyleOptions, (o) => { return o.value === 'regular' })
    let defaultFontStyle = regularStyle ? regularStyle.value : fontStyleOptions[ 0 ].value
    defaultFontStyle = this.getFontVariant(defaultFontStyle)
    this.loadFonts(value, defaultFontStyle)
  }

  handleFontStyleChange (fieldKey, value) {
    this.loadFonts(this.state.value.fontFamily, this.getFontVariant(value))
  }

  createOptionsArray (key) {
    let newArray = []
    googleFonts.forEach((item) => {
      let arrayItem = {
        label: item[ key ],
        value: item[ key ]
      }
      newArray.push(arrayItem)
    })
    return newArray
  }

  createStyleArray (fontFamily) {
    let newArray = []
    let variants = ''

    googleFonts.forEach((item) => {
      if (item.family === fontFamily) {
        variants = item.variants
      }
    })

    variants.forEach((item) => {
      newArray.push({
        label: this.parseFontVariant(item),
        value: item
      })
    })

    return newArray
  }

  getFontVariant (variant) {
    let number = variant.match(/\d+/g)
    let word = variant.match(/[a-z]+$/i)
    let fontWeight = number ? number[ 0 ] : '400'
    let fontStyle = word && word[ 0 ] === 'italic' ? 'italic' : 'regular'
    return { weight: fontWeight, style: fontStyle }
  }

  parseFontVariant (variant) {
    let fontVariant = this.getFontVariant(variant)
    let fontWeightDefinition = GoogleFonts.fontWeight[ fontVariant.weight ]
    let fontStyle = fontVariant.style === 'italic' ? ' Italic' : ' Regular'
    return `${fontWeightDefinition} (${fontVariant.weight})` + fontStyle
  }

  createFieldValue (family, style, text, status) {
    let value = {
      fontFamily: family,
      fontStyle: style,
      status: status
    }

    text || text === '' ? value.fontText = text : ''

    this.updateFieldValue(value)
  }

  updateFieldValue (value) {
    let mergedValue = lodash.merge(this.state.value, value)
    this.setFieldValue(mergedValue)
  }

  loadFonts (family, style, text) {
    webFontLoader.load({
      google: {
        families: [ `${family}:${style.weight + style.style}` ]
      },
      inactive: this.createFieldValue.bind(this, family, style, text, 'inactive'),
      active: this.createFieldValue.bind(this, family, style, text, 'active'),
      loading: this.createFieldValue.bind(this, family, style, text, 'loading')
    })
  }

  render () {
    let fontStyleArray = this.createStyleArray(this.state.value.fontFamily)

    let fontStyleOptions = {
      values: fontStyleArray
    }
    let fontFamilyOptions = {
      values: this.createOptionsArray('family')
    }

    let fontTextProps = {}

    let previewText = this.state.value.fontText

    if (this.state.value.status === 'loading') {
      previewText = 'Loading Font...'
    } else if (this.state.value.status === 'active') {
      fontTextProps.style = {
        fontFamily: this.state.value.fontFamily,
        fontWeight: this.state.value.fontStyle.weight,
        fontStyle: this.state.value.fontStyle.style
      }
    } else if (this.state.value.status === 'inactive') {
      previewText = 'Loading google font failed.'
    }

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
                value={this.state.value.fontStyle.weight + this.state.value.fontStyle.style}
                updater={this.handleFontStyleChange}
                api={this.props.api}
                fieldKey={`${this.props.fieldKey}.fontStyle`}
              />
            </div>
          </div>
        </div>
        <div className='vcv-ui-form-group'>
          <span className='vcv-ui-font-preview-text' {...fontTextProps}>{previewText}</span>
          <p className='vcv-ui-form-helper'>Click on preview to change it to your preferences</p>
        </div>
      </div>
    )
  }
}
