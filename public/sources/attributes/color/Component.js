'use strict'

import VcSketchPicker from './lib/sketch/Sketch'
import React from 'react'
import Attribute from '../attribute'
import './css/styles.less'
import tinycolor from 'react-color/modules/tinycolor2'
import classNames from 'classnames'
import _ from 'lodash'

class Color extends Attribute {

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
    let $dropDown = '.vcv-ui-sketch-picker'
    let $openingButton = '.vcv-ui-color-picker-dropdown'
    let container = null

    if ($el.closest === undefined) {
      container = this.getClosest($el, $dropDown) || this.getClosest($el, $openingButton)
    } else {
      container = $el.closest($dropDown) || $el.closest($openingButton)
    }
    if (container) {
      return
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

  handleChange = (sketchValue) => {
    let { format } = this.props.options
    let { updater, fieldKey } = this.props
    let color = tinycolor(sketchValue.rgb)
    let value = color.toString(format || 'rgb')
    if (value === 'rgba(0, 0, 0, 0)') {
      value = ''
    }

    this.setState({
      value: value
    })
    updater(fieldKey, value)
  }

  render () {
    let { value, displayColorPicker } = this.state
    let color = tinycolor(value)
    let colorStyle = {
      background: _.isEmpty(value) ? null : color.toString('rgb')
    }
    let swatchClasses = ['vcv-ui-form-dropdown-color-swatch']
    if (_.isEmpty(value)) {
      color = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAG5JREFUOBFjZCATvI+MtP//9+9aRnL0wzUzMweTbACyZsHlyw+SZAC6ZpDriTYAm2aiDcClmSgD8GkmaAAhzXgNIEYzTgOI1YzVAFI0YxhAqmYUA8jRDDeAXM1gAyjRDDKACZwlgbkKlDFAAqQCAB5beZgTNEIdAAAAAElFTkSuQmCC")'
      colorStyle.backgroundSize = 'cover'
      colorStyle.backgroundColor = ''
      colorStyle.backgroundImage = color
      swatchClasses.push('vcv-ui-form-dropdown-color--no-color')
    }
    swatchClasses = classNames(swatchClasses)

    let selectorClasses = classNames({
      'vcv-ui-form-dropdown': true,
      'vcv-ui-color-picker-dropdown': true,
      'vcv-ui-form-state--focus': this.state.displayColorPicker
    })

    let colorPicker = ''
    if (displayColorPicker) {
      colorPicker = (
        <div className='vcv-ui-sketch-picker-container'>
          <div className='vcv-ui-sketch-picker'>
            <VcSketchPicker color={color} presetColors={this.props.presetColors} onChange={this.handleChange} />
          </div>
        </div>
      )
    }
    return (
      <div>
        <div className={selectorClasses} onClick={this.handleClick}>
          <div className={swatchClasses}>
            <div className='vcv-ui-form-dropdown-color-value' style={colorStyle} />
          </div>
        </div>
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
