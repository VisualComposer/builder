import React from 'react'
import classNames from 'classnames'
import Representer from '../../representer'

export default class Backend extends Representer {
  getHex (val) {
    return parseInt(val, 10).toString(16).slice(-2)
  }

  rgbToHex (rgb) {
    return `#${this.getHex(rgb[1])}${this.getHex(rgb[2])}${this.getHex(rgb[3])}`
  }

  handleRgb (value) {
    let rgbaRegExp = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
    let rgb = value.match(rgbaRegExp)
    if (rgb[4]) {
      return `${this.rgbToHex(rgb)}, Opacity ${rgb[4] * 100}%;`
    }
    return `${this.rgbToHex(rgb)};`
  }

  getOutput (value) {
    let hexRegExp = /[0-9A-Fa-f]{6}/g
    if (value.match(hexRegExp)) {
      return `${value};`
    }
    return this.handleRgb(value)
  }

  render () {
    let output = this.getOutput(this.state.value)
    let classes = classNames({
      'vcv-wpbackend-attributes-content': true,
      'vcv-wpbackend-attr-representer-color': true
    })
    let sampleClasses = classNames({
      'vcv-wpbackend-attr-representer-color--sample': true
    })
    let valueClasses = classNames({
      'vcv-wpbackend-attr-representer-color--value': true
    })
    return <div className={classes}>
      <span className={sampleClasses} style={{background: this.state.value}} />
      <span className={valueClasses}>{output}</span>
    </div>
  }
}
