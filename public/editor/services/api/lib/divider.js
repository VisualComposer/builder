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
    type: PropTypes.string
  }

  getPublicImage (filename) {
    let { metaAssetsPath } = this.props
    return filename.match('^(https?:)?\\/\\/?') ? filename : metaAssetsPath + filename
  }

  render () {
    let { deviceData, deviceKey, id, applyDivider, type } = this.props
    let dividerType = `divider${type}`
    let dividerShape = deviceData[ `${dividerType}Shape` ]
    let dividerBackgroundImage = deviceData[ `${dividerType}BackgroundImage` ]
    let dividerBackgroundColor = deviceData[ `${dividerType}BackgroundColor` ]
    let dividerWidth = deviceData[ `${dividerType}Width` ]
    let dividerHeight = deviceData[ `${dividerType}Height` ]
    let percentageHeight = deviceData[ `${dividerType}Height` ] || '20'
    let dividerBackgroundStyle = deviceData[ `${dividerType}BackgroundStyle` ]
    let dividerBackgroundPosition = deviceData[ `${dividerType}BackgroundPosition` ]
    let dividerFlipHorizontal = deviceData[ `${dividerType}FlipHorizontal` ]
    let dividerBackgroundGradientStartColor = deviceData[ `${dividerType}BackgroundGradientStartColor` ]
    let dividerBackgroundGradientEndColor = deviceData[ `${dividerType}BackgroundGradientEndColor` ]
    let dividerBackgroundGradientAngle = deviceData[ `${dividerType}BackgroundGradientAngle` ]
    let dividerBackgroundType = deviceData[ `${dividerType}BackgroundType` ]
    let dividerVideoEmbed = deviceData[ `${dividerType}VideoEmbed` ]
    let dividerVideoYoutube = deviceData[ `${dividerType}VideoYoutube` ]
    let dividerVideoVimeo = deviceData[ `${dividerType}VideoVimeo` ]

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
      [backgroundPositionClass]: dividerBackgroundPosition,
      'vce-container-divider-new': true
    }, `vce-visible-${deviceKey}-only`)

    let fill = dividerBackgroundColor
    let height = dividerHeight || '200'
    let width = dividerWidth || '100'
    width = `${width}%`

    let shape = dividerShape && dividerShape.icon
    shape = shape && shape.split(' ')[ 1 ].replace('vcv-ui-icon-divider-', '')

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
            videoEmbed={dividerVideoEmbed} type={type} percentageHeight={percentageHeight}
            videoYoutube={dividerVideoYoutube} videoVimeo={dividerVideoVimeo} />
        </div>
      </div>
    )
  }
}
