import React from 'react'
const { Component, PropTypes } = React
let shapes = require('./shapes')

export default class DividerShape extends Component {
  static propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    fill: PropTypes.string,
    shape: PropTypes.string,
    position: PropTypes.string,
    fillType: PropTypes.string,
    backgroundImage: PropTypes.string,
    id: PropTypes.string
  }

  getLinearGradient () {
    if (this.props.fillType !== 'gradient') {
      return null
    }

    const startColor = this.props.gradientColorStart
    const endColor = this.props.gradientColorEnd
    let id = `gradient-${this.props.id}`
    return (
      <linearGradient id={id} x1='0%' y1='0%' x2='100%' y2='0%'>
        <stop offset='0%' style={{ stopColor: startColor, stopOpacity: '1' }} />
        <stop offset='100%' style={{ stopColor: endColor, stopOpacity: '1' }} />
      </linearGradient>
    )
  }

  getBackgroundImagePattern () {
    if (this.props.fillType !== 'image') {
      return null
    }

    let id = `image-${this.props.id}`
    return (
      <defs>
        <pattern id={id} patternUnits='userSpaceOnUse' width='100%' height='100%'>
          <image preserveAspectRatio='xMidYMid slice' xlinkHref={this.props.backgroundImage} x='0' y='0' width='100%' height='100%' />
        </pattern>
      </defs>
    )
  }

  render () {
    let { width, height, fill, shape, position, fillType, backgroundImage } = this.props

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

    if (fillType === 'color') {
      customAttributes.fill = fill
    } else if (fillType === 'gradient') {
      let id = `gradient-${this.props.id}`
      customAttributes.fill = `url(#${id})`
    } else if (fillType === 'image') {
      if (backgroundImage) {
        let id = `image-${this.props.id}`
        customAttributes.fill = `url(#${id})`
      } else {
        customAttributes.fill = '#424242'
      }
    }

    return (
      <svg viewBox={viewBox} preserveAspectRatio='none' width={width} height={height}>
        {this.getLinearGradient()}
        {this.getBackgroundImagePattern()}
        <g className='vce-svg-custom-rotation' {...customAttributes} dangerouslySetInnerHTML={{ __html: html }} />
      </svg>
    )
  }
}
