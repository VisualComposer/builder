'use strict'

import {SketchPicker} from 'react-color'
import React from 'react'
import Attribute from '../attribute'
// import lodash from 'lodash'
import './css/styles.less'
import tinycolor from 'react-color/modules/tinycolor2'

class Color extends Attribute {

  updateState (props) {
    // let { type } = this.props.options
    let value = props.value
    if (!value) {
      value = '#FFFFFF'
    }
    let color = tinycolor(value)

    let colorState = {
      hex: `#${color.toHex()}`,
      rgb: color.toRgb()
    }

    return {
      value: colorState,
      update: props.update
    }
  }

  handleClick = () => {
    this.setState({
      displayColorPicker: !this.state.displayColorPicker,
      update: true
    })
  }

  handleClose = () => {
    this.setState({
      displayColorPicker: false,
      update: true
    })
  }

  handleChange = (color) => {
    let { type } = this.props.options
    let { updater, fieldKey } = this.props
    let value = color
    if (typeof type !== 'undefined') {
      value = color[ type ]
    }
    this.setState({
      value: color,
      update: true
    })
    updater(fieldKey, value)
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (typeof nextState.update !== 'undefined') {
      return !!nextState.update
    }
    return true
  }

  render () {
    let { value, displayColorPicker } = this.state
    let color = tinycolor(value.rgb)
    let colorPicker = ''
    let { r, g, b, a } = value.rgb
    let colorStyle = {
      background: `rgba(${r}, ${g}, ${b}, ${a})`
    }

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
