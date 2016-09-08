'use strict'

import VcSketchPicker from './lib/sketch/Sketch'
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
        <div className='vcv-ui-form-dropdown-color--content'>
          <VcSketchPicker color={color} presetColors={this.props.presetColors} onChange={this.handleChange} />
        </div>
      )
    }
    return (
      <div>
        <div className='vcv-ui-form-dropdown' onClick={this.handleClick}>
          <div className='vcv-ui-form-dropdown-color--swatch'>
            <div className='vcv-ui-form-dropdown-color--value' style={colorStyle} />
          </div>
        </div>
        {colorPicker}
      </div>
    )
  }
}
Color.defaultProps = {
  presetColors: [ '#ffffff', '#ededed', '#dadada', '#c6c6c6', '#555555', '#3e3d3d', '#2f2f2f', '#212121', '#ff827b', '#ff3f3b', '#e11612', '#b82e24', '#f88749', '#f96c31', '#ec5418', '#bc4826', '#ffcd58', '#e7b460', '#cc8b4a', '#a78461', '#fff7a2', '#ffed47', '#ffde00', '#ffc000', '#c8db39', '#a8d228', '#8ac60a', '#579202', '#40c651', '#119944', '#0a8136', '#056a39', '#4dd1ab', '#16b095', '#0c9c86', '#088382', '#4dc5cc', '#1da0c5', '#0b6e8f', '#0b556e', '#4d8fcc', '#1d64c5', '#0b4c8f', '#103c6a', '#6567df', '#484bc7', '#4530c2', '#263382', '#9461d3', '#9d41d1', '#841fbe', '#6c258a', '#d85bd3', '#cf33af', '#a12c87', '#811e6c', '#d46094', '#d6456e', '#c11a4a', '#911e37' ],
  options: {
    format: 'rgb'
  }
}

export default Color
