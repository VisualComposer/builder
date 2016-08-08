'use strict'

import {SketchPicker} from 'react-color'
import React from 'react'
import Attribute from '../attribute'
import lodash from 'lodash'
import './css/styles.less'

class Color extends Attribute {
  state = {
    displayColorPicker: false,
    value: this.normalizeValue(this.props)
  }

  normalizeValue (props) {
    let value = props.value
    if (!lodash.isObject(value)) {
      value = {
        'hsl': {
          'h': 0,
          's': 0.6736401673640168,
          'l': 0.44215,
          'a': 1
        },
        'hex': '#bd2525',
        'rgb': {
          'r': 189,
          'g': 37,
          'b': 37,
          'a': 1
        },
        'hsv': {
          'h': 0,
          's': 0.805,
          'v': 0.74,
          'a': 1
        },
        'oldHue': 0,
        'source': 'rgb'
      }
    }

    return value
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  }

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  }

  handleChange = (color) => {
    this.setFieldValue(color)
  }

  render () {
    let { value, displayColorPicker } = this.state

    let colorPicker = ''
    let { r, g, b, a } = value.rgb
    let colorStyle = {
      background: `rgba(${r}, ${g}, ${b}, ${a})`
    }

    if (displayColorPicker) {
      colorPicker = (
        <div className='vcv-ui-form-input-color--popover'>
          <div className='vcv-ui-form-input-color--cover' onClick={this.handleClose} />
          <SketchPicker color={value} onChange={this.handleChange} />
        </div>
      )
    }
    return (
      <div className='vcv-ui-form-input-color'>
        <div className='vcv-ui-form-input-color--swatch' onClick={this.handleClick}>
          <div className='vcv-ui-form-input-color--value' style={colorStyle} />
        </div>
        {colorPicker}
      </div>
    )
  }
}

export default Color
