'use strict'

import VcSketchPicker from './lib/sketch/Sketch'
import React from 'react'
import Attribute from '../attribute'
import './css/styles.less'
import tinycolor from 'react-color/modules/tinycolor2'
import classNames from 'classnames'
import _ from 'lodash'

class Color extends Attribute {

  getEmptyColor () {
    return `rgba(186, 218, 85, 0)`
  }

  getTransparentColor () {
    return `rgba(0, 0, 0, 0)`
  }

  getClosest (el, selector) {
    let matchesFn;
    // find vendor prefix
    [ 'matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector' ].some(function (fn) {
      if (typeof document.body[ fn ] === 'function') {
        matchesFn = fn

        return true
      }

      return false
    })
    let parent
    // traverse parents
    while (el) {
      parent = el.parentElement
      if (parent && parent[ matchesFn ](selector)) {
        return parent
      }
      el = parent
    }

    return null
  }

  updateState (props) {
    let value = props.value
    return {
      value: value ? tinycolor(value).toString('rgb') : ''
    }
  }

  closeIfNotInside = (e) => {
    e && e.preventDefault()
    let $el = e.target
    let $defaultButton = '.vcv-ui-form-button'
    let $dropDown = '.vcv-ui-sketch-picker'
    let $openingButton = '.vcv-ui-color-picker-dropdown'
    let container = null
    let defaultButton = null

    if ($el.closest === undefined) {
      container = this.getClosest($el, $dropDown) || this.getClosest($el, $openingButton)
      defaultButton = this.getClosest($el, $defaultButton)
    } else {
      container = $el.closest($dropDown) || $el.closest($openingButton)
      defaultButton = $el.closest($defaultButton)
    }
    if (container) {
      return
    }
    if (defaultButton) {
      this.handleDefaultColor()
    }
    this.handleClick(e)
  }

  handleClick = (e) => {
    e && e.preventDefault()
    if (this.state.displayColorPicker) {
      document.body.removeEventListener('click', this.closeIfNotInside)
    } else {
      document.body.addEventListener('click', this.closeIfNotInside)
    }
    this.setState({
      displayColorPicker: !this.state.displayColorPicker
    })
  }

  handleChange (sketchValue) {
    let { format } = this.props.options
    let { updater, fieldKey } = this.props
    let color = tinycolor(sketchValue.rgb)
    let value = color.toString(format || 'rgb')
    // no color value
    if (value === this.getEmptyColor()) {
      value = ''
    }

    this.setState({
      value: value
    })
    updater(fieldKey, value)
  }

  handleDefaultColor () {
    let defaultColor = this.props.defaultValue
    if (defaultColor === '') {
      defaultColor = this.getEmptyColor()
    }
    defaultColor = tinycolor(defaultColor)
    this.handleChange({ rgb: defaultColor.toRgb() })
  }

  render () {
    let { presetColors, options } = this.props
    let disableAlpha = this.props.options.hasOwnProperty('disableAlpha') ? this.props.options.disableAlpha : false
    let { value, displayColorPicker } = this.state
    let color = tinycolor(value)
    let colorStyle = {
      background: _.isEmpty(value) ? null : color.toString('rgb')
    }
    let swatchClasses = [ 'vcv-ui-form-dropdown-color-swatch' ]
    if (_.isEmpty(value)) {
      colorStyle.background = null
      swatchClasses.push('vcv-ui-form-dropdown-color--no-color')
    }
    if (value === this.getTransparentColor()) {
      colorStyle.background = null
      swatchClasses.push('vcv-ui-form-dropdown-color--transparent')
    }
    swatchClasses = classNames(swatchClasses)

    let selectorClasses = classNames({
      'vcv-ui-form-dropdown': true,
      'vcv-ui-color-picker-dropdown': true,
      'vcv-ui-form-state--focus': this.state.displayColorPicker
    })
    if (options.hasOwnProperty('showTransparent') && !options.showTransparent && presetColors.indexOf('transparent') > -1) {
      presetColors.splice(presetColors.indexOf('transparent'), 1)
    }

    let colorPicker = ''
    let defaultPicker = ''
    if (displayColorPicker) {
      colorPicker = (
        <div className='vcv-ui-sketch-picker-container'>
          <div className='vcv-ui-sketch-picker'>
            <VcSketchPicker color={color} presetColors={presetColors} onChange={this.handleChange} disableAlpha={disableAlpha} />
          </div>
        </div>
      )
      defaultPicker = (
        <button className='vcv-ui-form-button vcv-ui-form-button--default' onClick={this.handleDefaultColor}>
          <span>Default</span>
        </button>
      )
    }
    return (
      <div>
        <div className={selectorClasses} onClick={this.handleClick}>
          <div className={swatchClasses}>
            <div className='vcv-ui-form-dropdown-color-value' style={colorStyle} />
          </div>
        </div>
        {defaultPicker}
        {colorPicker}
      </div>
    )
  }
}
Color.defaultProps = {
  presetColors: [ 'transparent', '#ffffff', '#ededed', '#dadada', '#c6c6c6', '#555555', '#3e3d3d', '#2f2f2f', '#212121', '#ff827b', '#ff3f3b', '#e11612', '#b82e24', '#f88749', '#f96c31', '#ec5418', '#bc4826', '#ffcd58', '#e7b460', '#cc8b4a', '#a78461', '#fff7a2', '#ffed47', '#ffde00', '#ffc000', '#c8db39', '#a8d228', '#8ac60a', '#579202', '#40c651', '#119944', '#0a8136', '#056a39', '#4dd1ab', '#16b095', '#0c9c86', '#088382', '#4dc5cc', '#1da0c5', '#0b6e8f', '#0b556e', '#4d8fcc', '#1d64c5', '#0b4c8f', '#103c6a', '#6567df', '#484bc7', '#4530c2', '#263382', '#9461d3', '#9d41d1', '#841fbe', '#6c258a', '#d85bd3', '#cf33af', '#a12c87', '#811e6c', '#d46094', '#d6456e', '#c11a4a', '#911e37' ],
  options: {
    format: 'rgb'
  }
}

export default Color
