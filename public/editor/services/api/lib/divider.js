import React from 'react'
import classNames from 'classnames'
import DividerShape from './dividerShape'
const { Component, PropTypes } = React
import vcCake from 'vc-cake'

export default class Divider extends Component {
  static propTypes = {
    deviceData: PropTypes.object,
    deviceKey: PropTypes.string,
    metaAssetsPath: PropTypes.string,
    id: PropTypes.string,
    applyDivider: PropTypes.object
  }

  getPublicImage (filename) {
    let { metaAssetsPath } = this.props
    return filename.match('^(https?:)?\\/\\/?') ? filename : metaAssetsPath + filename
  }

  render () {
    let { deviceData, deviceKey, id, applyDivider } = this.props
    let { dividerShape, dividerShapeNew, dividerBackgroundImage, dividerBackgroundColor, dividerWidth, dividerHeight, dividerBackgroundStyle, dividerBackgroundPosition, dividerFlipHorizontal, dividerBackgroundGradientStartColor, dividerBackgroundGradientEndColor, dividerBackgroundGradientAngle, dividerBackgroundType, dividerVideoEmbed } = deviceData

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

    if (vcCake.env('NEW_DIVIDER_SHAPES')) {
      shape = dividerShapeNew && dividerShapeNew.icon
      shape = shape && shape.split(' ')[ 1 ].replace('vcv-ui-icon-divider-', '')
    }

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
      <div className={containerClasses} {...applyDivider}>
        <div className='vce-container-divider-inner'>
          <DividerShape id={id} shape={shape} width={width} height={height} fill={fill} fillType={dividerBackgroundType} gradientColorStart={dividerBackgroundGradientStartColor} gradientColorEnd={dividerBackgroundGradientEndColor} gradientAngle={dividerBackgroundGradientAngle} backgroundImage={imageUrl} flipHorizontally={flipHorizontally} deviceKey={deviceKey} videoEmbed={dividerVideoEmbed} />
        </div>
      </div>
    )
  }
}
