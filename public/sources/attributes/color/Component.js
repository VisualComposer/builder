'use strict'

import {SketchPicker} from 'react-color'
import React from 'react'
import Attribute from '../attribute'
import lodash from 'lodash'
import './css/styles.less'

class Color extends Attribute {
  state = {
    displayColorPicker: false
  }

  constructor (props) {
    super(props)
    if (!lodash.isObject(props.value)) {
      this.state.value = { r: '255', g: '255', b: '255', a: '1' }
    }
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  }

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  }

  handleChange = (color) => {
    this.setFieldValue(color.rgb)
  }

  render () {
    let { value, displayColorPicker } = this.state

    let colorPicker = ''
    let colorStyle = {
      background: `rgba(${value.r}, ${value.g}, ${value.b}, ${value.a})`
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
