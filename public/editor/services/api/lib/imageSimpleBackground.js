import React from 'react'
import classNames from 'classnames'
const { Component, PropTypes } = React
export default class ImageSimpleBackground extends Component {
  static propTypes = {
    id: PropTypes.string,
    atts: PropTypes.object,
    editor: PropTypes.object
  }

  render () {
    const { reactKey, deviceKey, deviceData, applyBackground } = this.props
    const { images, backgroundStyle, parallax, parallaxSpeed } = deviceData
    if (images && images.urls && images.urls.length) {
      let customProps = {}
      let imagesJSX = []
      images.urls.forEach((imgData) => {
        let styles = {
          backgroundImage: `url(${imgData.full})`
        }
        let imgKey = `${reactKey}-${imgData.id}`
        imagesJSX.push((
          <div className='vce-asset-background-simple-item' style={styles} key={imgKey} />
        ))
      })
      let containerClasses = [
        `vce-asset-background-simple-container`,
        `vce-visible-${deviceKey}-only`
      ]
      if (backgroundStyle) {
        containerClasses.push(`vce-asset-background-simple--style-${backgroundStyle}`)
      }
      let slideshowClasses = classNames([
        `vce-asset-background-simple`
      ])
      if (parallax) {
        customProps[ 'data-vce-assets-parallax' ] = '.vce-asset-background-simple'
      }
      if (parallax === 'simple-fade') {
        customProps[ 'data-vce-assets-parallax-fade' ] = true
      }
      if (parallaxSpeed) {
        customProps[ 'data-vce-assets-parallax-speed' ] = parallaxSpeed
      }
      return <div className={classNames(containerClasses)} {...customProps} key={reactKey} {...applyBackground}>
        <div className={classNames(slideshowClasses)}>
          {imagesJSX}
        </div>
      </div>
    }
    return null
  }
}
