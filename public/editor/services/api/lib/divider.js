import React from 'react'
import classNames from 'classnames'
import DividerShape from './dividerShape'
const { Component, PropTypes } = React

export default class Divider extends Component {
  static propTypes = {
    deviceData: PropTypes.object,
    deviceKey: PropTypes.string
  }

  render () {
    let { deviceData, deviceKey } = this.props
    let position = deviceData && deviceData.dividerPosition
    let flipHorizontally = false

    if (deviceData && deviceData.dividerFlipHorizontal === 'horizontally-right') {
      flipHorizontally = true
    }

    let containerClasses = classNames({
      'vce-container-divider': true,
      'vce-container-divider-flip--horizontally': flipHorizontally
    }, `vce-container-divider-position--${position}`, `vce-visible-${deviceKey}-only`)

    let fill = deviceData && deviceData.dividerBackgroundColor
    let height = deviceData && deviceData.dividerHeight ? deviceData.dividerHeight : '100'
    let width = deviceData && deviceData.dividerWidth ? deviceData.dividerWidth : '100'
    height = `${height}%`
    width = `${width}%`

    let rotation = deviceData && deviceData.dividerRotation
    let customRotation = rotation ? parseInt(rotation) - 180 : null
    let rotationTransform = customRotation ? `rotate(${customRotation})` : ''

    let shape = deviceData && deviceData.dividerShape && deviceData.dividerShape.icon
    shape = shape && shape.split(' ')[ 1 ].replace('vcv-ui-icon-dividers-', '')

    return (
      <div className={classNames(containerClasses)}>
        <DividerShape position={position} shape={shape} width={width} height={height} customRotation={rotationTransform}
          fill={fill} fillType={deviceData.dividerBackgroundType} gradientColorStart={deviceData.dividerBackgroundGradientStartColor} gradientColorEnd={deviceData.dividerBackgroundGradientEndColor} />
      </div>
    )
  }
}
