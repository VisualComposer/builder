import React from 'react'
import classNames from 'classnames'
import DividerShape from './dividerShape'
const { Component, PropTypes } = React

export default class Divider extends Component {
  static propTypes = {
    atts: PropTypes.object,
    deviceData: PropTypes.object,
    deviceKey: PropTypes.string
  }

  static defaults = {
    backgroundColor: '#424242'
  }

  render () {
    let { deviceData, deviceKey } = this.props
    let position = deviceData && deviceData.dividerPosition
    let containerClasses = [
      `vce-container-divider`,
      `vce-container-divider-position--${position}`,
      `vce-visible-${deviceKey}-only`
    ]

    let fill = deviceData && deviceData.dividerBackgroundColor ? deviceData.dividerBackgroundColor : Divider.defaults.backgroundColor
    let height = deviceData && deviceData.dividerHeight ? deviceData.dividerHeight : '100'
    let width = deviceData && deviceData.dividerWidth ? deviceData.dividerWidth : '100'
    height = `${height}%`
    width = `${width}%`

    let rotation = deviceData && deviceData.dividerRotation
    let customRotation = rotation ? parseInt(rotation) - 180 : null
    let rotationTransform = customRotation ? `rotate(${customRotation})` : ''

    let shape = deviceData && deviceData.dividerShape && deviceData.dividerShape.icon
    let shapeIconArrayClass = shape && shape.split('-')
    shape = shapeIconArrayClass[ shapeIconArrayClass.length - 1 ]

    return (
      <div className={classNames(containerClasses)}>
        <DividerShape position={position} shape={shape} width={width} height={height} customRotation={rotationTransform} fill={fill} />
      </div>
    )
  }
}
