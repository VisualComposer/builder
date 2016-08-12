'use strict'

import {SketchPicker} from 'react-color'
import React from 'react'
import Attribute from '../attribute'
import './css/styles.less'
import tinycolor from 'react-color/modules/tinycolor2'

class Color extends Attribute {

  updateState (props) {
    let value = props.value
    if (!value) {
      value = '#FFFFFF'
    }
    let color = tinycolor(value)

    return {
      value: color.toString('rgb')
    }
  }

  handleClick = () => {
    this.setState({
      displayColorPicker: !this.state.displayColorPicker
    })
  }

  handleClose = () => {
    this.setState({
      displayColorPicker: false
    })
  }

  handleChange = (sketchValue) => {
    let { format } = this.props.options
    let { updater, fieldKey } = this.props
    let color = tinycolor(sketchValue.rgb)
    let value = color.toString(format || 'rgb')
    this.setState({
      value: value
    })
    updater(fieldKey, value)
  }

  render () {
    let { value, displayColorPicker } = this.state
    let color = tinycolor(value)
    let colorStyle = {
      background: color.toString('rgb')
    }

    let colorPicker = ''
    if (displayColorPicker) {
      colorPicker = (
        <div className='vcv-ui-form-input-color--popover'>
          <div className='vcv-ui-form-input-color--cover' onClick={this.handleClose} />
          <SketchPicker color={color} onChange={this.handleChange} />
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
