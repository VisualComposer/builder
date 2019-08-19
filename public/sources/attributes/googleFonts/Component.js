import React from 'react'
import Attribute from '../attribute'
import lodash from 'lodash'
import fonts from './lib/google-fonts-set.json'
import webFontLoader from 'webfontloader'

import Dropdown from '../dropdown/Component'

const googleFonts = fonts.families

export default class GoogleFonts extends Attribute {
  static defaultProps = {
    fieldType: 'googleFonts'
  }

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
      weight: '400',
      style: 'regular'
    },
    loading: ''
  }

  constructor (props) {
    super(props)
    props.setInnerFieldStatus && props.setInnerFieldStatus()
    this.handleFontFamilyChange = this.handleFontFamilyChange.bind(this)
    this.handleFontStyleChange = this.handleFontStyleChange.bind(this)
    this.createFieldValue = this.createFieldValue.bind(this)
    this.updateFieldValue = this.updateFieldValue.bind(this)
  }

  UNSAFE_componentWillMount () {
    let { value } = this.state
    if (!googleFonts.find(font => font.family === this.state.value.fontFamily)) {
      value.fontFamily = GoogleFonts.defaultFontOptions.fontFamily
      value.fontStyle = GoogleFonts.defaultFontOptions.fontStyle
    }
    let mergedValue = lodash.defaultsDeep({}, value, GoogleFonts.defaultFontOptions)
    this.loadFonts(mergedValue.fontFamily, mergedValue.fontStyle, mergedValue.fontText)
  }

  handleFontFamilyChange (fieldKey, value) {
    let fontStyleOptions = this.createStyleArray(value)
    let regularStyle = lodash.find(fontStyleOptions, (o) => { return o.value === '400regular' })
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
    let family = googleFonts.find(item => item.family === fontFamily)
    let variants = family.variants

    variants.forEach((item) => {
      let fontStyle = this.getFontVariant(item)

      newArray.push({
        label: this.parseFontVariant(item),
        value: fontStyle.weight + fontStyle.style
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

    if (text || text === '') {
      value.fontText = text
    }

    this.updateFieldValue(value)
  }

  updateFieldValue (value) {
    let mergedValue = lodash.defaultsDeep({}, value, this.state.value)
    this.setFieldValue(mergedValue)
  }

  getFontSubsets (family) {
    const selectedFont = googleFonts.find(font => font.family === family)
    return selectedFont.subsets
  }

  loadFonts (family, style, text) {
    let iframe = window.document.getElementById('vcv-editor-iframe')
    let iframeSettings = {}
    iframe && iframe.contentWindow && (iframeSettings.context = iframe.contentWindow)
    let fontStyle = style.style === 'regular' ? '' : style.style
    const subsets = this.getFontSubsets(family)
    webFontLoader.load({
      google: {
        families: [ `${family}:${style.weight + fontStyle}:${subsets}` ]
      },
      ...iframeSettings,
      fontinactive: this.createFieldValue.bind(this, family, style, text, 'inactive'),
      fontactive: this.createFieldValue.bind(this, family, style, text, 'active'),
      fontloading: this.createFieldValue.bind(this, family, style, text, 'loading')
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

    let fontfamilyContainerClasses = 'vcv-ui-google-fonts-fontfamily-container'
    let spinner = ''
    let loadedFail = ''

    if (this.state.value.status === 'loading') {
      fontfamilyContainerClasses += ' vcv-ui-google-fonts-spinner'
      spinner = (
        <span className='vcv-ui-wp-spinner' />
      )
    } else if (this.state.value.status === 'inactive') {
      loadedFail = (
        <div className='vcv-ui-form-group'>
          <span>Google fonts can not be loaded.</span>
        </div>
      )
    }

    return (
      <div className='vcv-ui-google-fonts-container'>
        <div className='vcv-ui-row vcv-ui-row-gap--md'>
          <div className='vcv-ui-col vcv-ui-col--fixed-width'>
            <div className='vcv-ui-form-group'>
              <span className='vcv-ui-form-group-heading'>
                Font Family
              </span>
              <div className={fontfamilyContainerClasses}>
                {spinner}
                <Dropdown
                  options={fontFamilyOptions}
                  value={this.state.value.fontFamily}
                  updater={this.handleFontFamilyChange}
                  api={this.props.api}
                  fieldKey={`${this.props.fieldKey}.fontFamily`}
                />
              </div>
            </div>
            {loadedFail}
          </div>
          <div className='vcv-ui-col vcv-ui-col--fixed-width'>
            <div className='vcv-ui-form-group'>
              <span className='vcv-ui-form-group-heading'>
                Font Style
              </span>
              <div className={fontfamilyContainerClasses}>
                {spinner}
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
        </div>
      </div>
    )
  }
}
