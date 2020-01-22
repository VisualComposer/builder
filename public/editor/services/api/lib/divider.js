import React from 'react'
import classNames from 'classnames'
import DividerShape from './dividerShape'
import PropTypes from 'prop-types'

export default class Divider extends React.Component {
  static propTypes = {
    deviceData: PropTypes.object,
    deviceKey: PropTypes.string,
    metaAssetsPath: PropTypes.string,
    id: PropTypes.string,
    applyDivider: PropTypes.object,
    type: PropTypes.string
  }

  getPublicImage (filename) {
    const { metaAssetsPath } = this.props
    return filename.match('^(https?:)?\\/\\/?') ? filename : metaAssetsPath + filename
  }

  render () {
    const { deviceData, deviceKey, id, applyDivider, type } = this.props
    const dividerType = `divider${type}`
    const dividerShape = deviceData[`${dividerType}Shape`]
    const dividerBackgroundImage = deviceData[`${dividerType}BackgroundImage`]
    const dividerBackgroundColor = deviceData[`${dividerType}BackgroundColor`]
    const dividerWidth = deviceData[`${dividerType}Width`]
    const dividerHeight = deviceData[`${dividerType}Height`]
    const percentageHeight = deviceData[`${dividerType}Height`] || '20'
    const dividerBackgroundStyle = deviceData[`${dividerType}BackgroundStyle`]
    const dividerBackgroundPosition = deviceData[`${dividerType}BackgroundPosition`]
    const dividerFlipHorizontal = deviceData[`${dividerType}FlipHorizontal`]
    const dividerBackgroundGradientStartColor = deviceData[`${dividerType}BackgroundGradientStartColor`]
    const dividerBackgroundGradientEndColor = deviceData[`${dividerType}BackgroundGradientEndColor`]
    const dividerBackgroundGradientAngle = deviceData[`${dividerType}BackgroundGradientAngle`]
    const dividerBackgroundType = deviceData[`${dividerType}BackgroundType`]
    const dividerVideoEmbed = deviceData[`${dividerType}VideoEmbed`]
    const dividerVideoYoutube = deviceData[`${dividerType}VideoYoutube`]
    const dividerVideoVimeo = deviceData[`${dividerType}VideoVimeo`]

    let flipHorizontally = false

    if (dividerFlipHorizontal === 'horizontally-right') {
      flipHorizontally = true
    }

    const backgroundStyleClass = `vce-container-divider-background-style--${dividerBackgroundStyle}`
    const backgroundPositionClass = `vce-container-divider-background-position--${dividerBackgroundPosition}`

    const containerClasses = classNames({
      'vce-container-divider': true,
      [`vce-divider-position--${type && type.toLowerCase()}`]: type,
      'vce-container-divider-flip--horizontally': flipHorizontally,
      [backgroundStyleClass]: dividerBackgroundStyle,
      [backgroundPositionClass]: dividerBackgroundPosition,
      'vce-container-divider-new': true
    }, `vce-visible-${deviceKey}-only`)

    const fill = dividerBackgroundColor
    const height = dividerHeight || '200'
    let width = dividerWidth || '100'
    width = `${width}%`

    let shape = dividerShape && dividerShape.icon
    shape = shape && shape.split(' ')[1].replace('vcv-ui-icon-divider-', '')

    let imageUrl = ''
    const images = dividerBackgroundImage

    if (images) {
      if (images.urls && images.urls.length) {
        imageUrl = images.urls[0].full
      } else if (images.length) {
        imageUrl = this.getPublicImage(images[0])
      }
    }

    return (
      <div className={containerClasses} {...applyDivider}>
        <div className='vce-container-divider-inner'>
          <DividerShape
            id={id} shape={shape} width={width} height={height} fill={fill} fillType={dividerBackgroundType}
            gradientColorStart={dividerBackgroundGradientStartColor}
            gradientColorEnd={dividerBackgroundGradientEndColor} gradientAngle={dividerBackgroundGradientAngle}
            backgroundImage={imageUrl} flipHorizontally={flipHorizontally} deviceKey={deviceKey}
            videoEmbed={dividerVideoEmbed} type={type} percentageHeight={percentageHeight}
            videoYoutube={dividerVideoYoutube} videoVimeo={dividerVideoVimeo}
          />
        </div>
      </div>
    )
  }
}
