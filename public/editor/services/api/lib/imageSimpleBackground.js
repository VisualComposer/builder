import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default class ImageSimpleBackground extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    atts: PropTypes.object,
    editor: PropTypes.object
  }

  getPublicImage (filename) {
    let { metaAssetsPath } = this.props.atts
    return filename && filename.match && filename.match('^(https?:)?\\/\\/?') ? filename : metaAssetsPath + filename
  }

  render () {
    const { reactKey, deviceKey, deviceData, images } = this.props
    const { backgroundStyle, backgroundPosition } = deviceData

    if (images) {
      let imagesJSX = []
      if (images.urls && images.urls.length) {
        images.urls.forEach((imgData, index) => {
          let styles = {
            backgroundImage: `url(${imgData.full})`
          }
          let customKey = imgData.id
          if (!imgData.id) {
            customKey = `${imgData.full}-${index}`
          }
          let imgKey = `${reactKey}-${customKey}`
          imagesJSX.push((
            <div className='vce-asset-background-simple-item' style={styles} key={imgKey} />
          ))
        })
      } else if (images.length) {
        images.forEach((imgData, index) => {
          let styles = {
            backgroundImage: `url(${this.getPublicImage(imgData)})`
          }
          let imgKey = `${reactKey}-${imgData}-${index}`
          imagesJSX.push((
            <div className='vce-asset-background-simple-item' style={styles} key={imgKey} />
          ))
        })
      }
      let containerClasses = [
        `vce-asset-background-simple-container`,
        `vce-visible-${deviceKey}-only`
      ]
      if (backgroundStyle) {
        containerClasses.push(`vce-asset-background-simple--style-${backgroundStyle}`)
      }
      if (backgroundPosition) {
        containerClasses.push(`vce-asset-background-simple--position-${backgroundPosition}`)
      }
      let slideshowClasses = classNames([
        `vce-asset-background-simple`
      ])

      return <div className={classNames(containerClasses)}>
        <div className={classNames(slideshowClasses)}>
          {imagesJSX}
        </div>
      </div>
    }

    return null
  }
}
