import React from 'react'
import classNames from 'classnames'
import DividerShape from './dividerShape'
const { Component, PropTypes } = React

export default class Divider extends Component {
  static propTypes = {
    deviceData: PropTypes.object,
    deviceKey: PropTypes.string,
    metaAssetsPath: PropTypes.string,
    id: PropTypes.string,
    applyDivider: PropTypes.object,
    index: PropTypes.number
  }

  getPublicImage (filename) {
    let { metaAssetsPath } = this.props
    return filename.match('^(https?:)?\\/\\/?') ? filename : metaAssetsPath + filename
  }

  render () {
    let { deviceData, deviceKey, id, applyDivider, index } = this.props
    let { dividerShape, dividerBackgroundImage, dividerBackgroundColor, dividerWidth, dividerHeight, dividerBackgroundStyle, dividerBackgroundPosition, dividerFlipHorizontal, dividerBackgroundGradientStartColor, dividerBackgroundGradientEndColor, dividerBackgroundType } = deviceData

    let flipHorizontally = false

    if (dividerFlipHorizontal === 'horizontally-right') {
      flipHorizontally = true
    }

    let backgroundStyleClass = `vce-container-divider-background-style--${dividerBackgroundStyle}`
    let backgroundPositionClass = `vce-container-divider-background-position--${dividerBackgroundPosition}`

    let containerClasses = classNames({
      'vce-container-divider': true,
      'vce-container-divider-flip--horizontally': flipHorizontally,
      [backgroundStyleClass]: dividerBackgroundStyle,
      [backgroundPositionClass]: dividerBackgroundPosition
    }, `vce-visible-${deviceKey}-only`)

    let fill = dividerBackgroundColor
    let height = dividerHeight || '200'
    let width = dividerWidth || '100'
    width = `${width}%`

    let shape = dividerShape && dividerShape.icon
    shape = shape && shape.split(' ')[ 1 ].replace('vcv-ui-icon-dividers-', '')

    let imageUrl = ''
    const images = dividerBackgroundImage

    if (images) {
      if (images.urls && images.urls.length) {
        imageUrl = images.urls[ 0 ].full
      } else if (images.length) {
        imageUrl = this.getPublicImage(images[ 0 ])
      }
    }

    return (
      <div className={classNames(containerClasses)} {...applyDivider}>
        <div className='vce-container-divider-inner'>
          <DividerShape id={id} shape={shape} width={width} height={height} fill={fill} fillType={dividerBackgroundType} gradientColorStart={dividerBackgroundGradientStartColor} gradientColorEnd={dividerBackgroundGradientEndColor} backgroundImage={imageUrl} flipHorizontally={flipHorizontally} index={index} />
        </div>
      </div>
    )
  }
}
