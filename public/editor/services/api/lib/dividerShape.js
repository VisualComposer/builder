import React from 'react'
const { Component, PropTypes } = React
let shapes = require('./shapes')

export default class DividerShape extends Component {
  static propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    customRotation: PropTypes.string,
    fill: PropTypes.string,
    shape: PropTypes.string,
    position: PropTypes.string,
    fillType: PropTypes.string
  }

  getLinearGradient () {
    if (this.props.fillType !== 'gradient') {
      return null
    }

    const startColor = this.props.gradientColorStart
    const endColor = this.props.gradientColorEnd

    return (
      <linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
        <stop offset='0%' style={{ stopColor: startColor, stopOpacity: '1' }} />
        <stop offset='100%' style={{ stopColor: endColor, stopOpacity: '1' }} />
      </linearGradient>
    )
  }

  render () {
    let { width, height, customRotation, fill, shape, position, fillType } = this.props

    if (!shapes[ shape ]) {
      return null
    }
    let customAttributes = {}
    let viewBoxWidth = shapes[ shape ].viewBox.width
    let viewBoxHeight = shapes[ shape ].viewBox.height
    let viewBox = `0 0 ${viewBoxWidth} ${viewBoxHeight}`
    let html = shapes[ shape ].html.horizontal

    if (position === 'left' || position === 'right') {
      viewBox = `0 0 ${viewBoxHeight} ${viewBoxWidth}`
      html = shapes[ shape ].html.vertical
    }

    if (customRotation) {
      customAttributes.transform = customRotation
    }

    if (fillType === 'color') {
      customAttributes.fill = fill
    } else if (fillType === 'gradient') {
      customAttributes.fill = 'url(#gradient)'
    }

    return (
      <svg viewBox={viewBox} preserveAspectRatio='none' width={width} height={height}>
        {this.getLinearGradient()}
        <g className='vce-svg-custom-rotation' {...customAttributes} dangerouslySetInnerHTML={{ __html: html }} />
      </svg>
    )
  }
}
