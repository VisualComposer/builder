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
    applyDivider: PropTypes.object,
    type: PropTypes.string
  }

  getPublicImage (filename) {
    let { metaAssetsPath } = this.props
    return filename.match('^(https?:)?\\/\\/?') ? filename : metaAssetsPath + filename
  }

  render () {
    let { deviceData, deviceKey, id, applyDivider, type } = this.props
    let { dividerShape, dividerBackgroundImage, dividerBackgroundColor, dividerWidth, dividerHeight, dividerBackgroundStyle, dividerBackgroundPosition, dividerFlipHorizontal, dividerBackgroundGradientStartColor, dividerBackgroundGradientEndColor, dividerBackgroundGradientAngle, dividerBackgroundType, dividerVideoEmbed } = deviceData
    let dividerType = `divider${type}`
    let percentageHeight = ''

    if (vcCake.env('NEW_DIVIDER_SHAPES')) {
      dividerShape = deviceData[ `${dividerType}Shape` ]
      dividerBackgroundImage = deviceData[ `${dividerType}BackgroundImage` ]
      dividerBackgroundColor = deviceData[ `${dividerType}BackgroundColor` ]
      dividerWidth = deviceData[ `${dividerType}Width` ]
      dividerHeight = deviceData[ `${dividerType}Height` ]
      percentageHeight = deviceData[ `${dividerType}Height` ] || '20'
      dividerBackgroundStyle = deviceData[ `${dividerType}BackgroundStyle` ]
      dividerBackgroundPosition = deviceData[ `${dividerType}BackgroundPosition` ]
      dividerFlipHorizontal = deviceData[ `${dividerType}FlipHorizontal` ]
      dividerBackgroundGradientStartColor = deviceData[ `${dividerType}BackgroundGradientStartColor` ]
      dividerBackgroundGradientEndColor = deviceData[ `${dividerType}BackgroundGradientEndColor` ]
      dividerBackgroundGradientAngle = deviceData[ `${dividerType}BackgroundGradientAngle` ]
      dividerBackgroundType = deviceData[ `${dividerType}BackgroundType` ]
      dividerVideoEmbed = deviceData[ `${dividerType}VideoEmbed` ]
    }

    let flipHorizontally = false

    if (dividerFlipHorizontal === 'horizontally-right') {
      flipHorizontally = true
    }

    let backgroundStyleClass = `vce-container-divider-background-style--${dividerBackgroundStyle}`
    let backgroundPositionClass = `vce-container-divider-background-position--${dividerBackgroundPosition}`

    let containerClasses = classNames({
      'vce-container-divider': true,
      [`vce-divider-position--${type && type.toLowerCase()}`]: type,
      'vce-container-divider-flip--horizontally': flipHorizontally,
      [backgroundStyleClass]: dividerBackgroundStyle,
      [backgroundPositionClass]: dividerBackgroundPosition
    }, `vce-visible-${deviceKey}-only`)

    let fill = dividerBackgroundColor
    let height = dividerHeight || '200'
    let width = dividerWidth || '100'
    width = `${width}%`

    let shape = dividerShape && dividerShape.icon

    if (vcCake.env('NEW_DIVIDER_SHAPES')) {
      shape = shape && shape.split(' ')[ 1 ].replace('vcv-ui-icon-divider-', '')
    } else {
      shape = shape && shape.split(' ')[ 1 ].replace('vcv-ui-icon-dividers-', '')
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
          <DividerShape id={id} shape={shape} width={width} height={height} fill={fill} fillType={dividerBackgroundType}
            gradientColorStart={dividerBackgroundGradientStartColor}
            gradientColorEnd={dividerBackgroundGradientEndColor} gradientAngle={dividerBackgroundGradientAngle}
            backgroundImage={imageUrl} flipHorizontally={flipHorizontally} deviceKey={deviceKey}
            videoEmbed={dividerVideoEmbed} type={type} percentageHeight={percentageHeight} />
        </div>
      </div>
    )
  }
}
