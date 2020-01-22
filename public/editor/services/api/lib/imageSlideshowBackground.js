import React from 'react'
import classNames from 'classnames'
import ReactDOMServer from 'react-dom/server'
import PropTypes from 'prop-types'

export default class ImageSlideshowBackground extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    atts: PropTypes.object,
    editor: PropTypes.object
  }

  getPublicImage (filename) {
    const { metaAssetsPath } = this.props.atts
    return filename.match('^(https?:)?\\/\\/?') ? filename : metaAssetsPath + filename
  }

  render () {
    const { reactKey, deviceKey, deviceData, images } = this.props
    const { backgroundStyle, backgroundPosition, sliderTimeout, sliderEffect, sliderDirection } = deviceData
    let timeout = sliderTimeout
    if (!timeout) {
      timeout = sliderEffect === 'carousel' ? 10 : 5
    }
    if (images) {
      const imagesJSX = []
      if (images.urls && images.urls.length) {
        images.urls.forEach((imgData, index) => {
          const styles = {
            backgroundImage: `url(${imgData.full})`
          }
          let customKey = imgData.id
          if (!imgData.id) {
            customKey = `${imgData.full}-${index}`
          }
          const imgKey = `${reactKey}-${customKey}`
          imagesJSX.push((
            <div className='vce-asset-background-slider-item' style={styles} key={imgKey} />
          ))
        })
      } else if (images.length) {
        images.forEach((imgData, index) => {
          const styles = {
            backgroundImage: `url(${this.getPublicImage(imgData)})`
          }
          const imgKey = `${reactKey}-${imgData}-${index}`
          imagesJSX.push((
            <div className='vce-asset-background-slider-item' style={styles} key={imgKey} />
          ))
        })
      }
      const containerClasses = [
        'vce-asset-background-slider-container',
        `vce-visible-${deviceKey}-only`
      ]
      if (backgroundStyle) {
        containerClasses.push(`vce-asset-background-slider--style-${backgroundStyle}`)
      }
      if (backgroundPosition) {
        containerClasses.push(`vce-asset-background-slider--position-${backgroundPosition}`)
      }
      const slideshowClasses = [
        'vce-asset-background-slider'
      ]

      const sliderProps = {
        'data-vce-assets-slider': timeout,
        'data-vce-assets-slider-effect': sliderEffect,
        'data-vce-assets-slider-direction': sliderDirection,
        'data-vce-assets-slider-slides': '.vce-asset-background-slider-items',
        'data-vce-assets-slider-slide': '.vce-asset-background-slider-item'
      }

      const vcvHelperHTML = ReactDOMServer.renderToStaticMarkup(
        <div className={classNames(slideshowClasses)} {...sliderProps}>
          <div className='vce-asset-background-slider-items'>
            {imagesJSX}
          </div>
        </div>)

      return <div className={classNames(containerClasses)}>
        <div className='vcvhelper' data-vcvs-html={vcvHelperHTML} dangerouslySetInnerHTML={{ __html: vcvHelperHTML }} />
      </div>
    }

    return null
  }
}
