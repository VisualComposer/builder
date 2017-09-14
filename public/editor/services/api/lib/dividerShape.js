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
    position: PropTypes.string
  }

  render () {
    let { width, height, customRotation, fill, shape, position } = this.props

    if (!shapes[ shape ]) {
      return null
    }

    let viewBoxWidth = shapes[ shape ].viewBox.width
    let viewBoxHeight = shapes[ shape ].viewBox.height
    let viewBox = `0 0 ${viewBoxWidth} ${viewBoxHeight}`
    let html = shapes[ shape ].html.horizontal

    if (position === 'left' || position === 'right') {
      viewBox = `0 0 ${viewBoxHeight} ${viewBoxWidth}`
      html = shapes[ shape ].html.vertical
    }

    return (
      <svg viewBox={viewBox} preserveAspectRatio='none' width={width} height={height}>
        <g className='vce-svg-custom-rotation' transform={customRotation} fill={fill} dangerouslySetInnerHTML={{ __html: html }} />
      </svg>
    )
  }
}
