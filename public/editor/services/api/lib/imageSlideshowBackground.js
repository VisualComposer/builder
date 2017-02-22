import React from 'react'
import classNames from 'classnames'
import ReactDOMServer from 'react-dom/server'

const { Component, PropTypes } = React
export default class ImageSlideshowBackground extends Component {
  static propTypes = {
    id: PropTypes.string,
    atts: PropTypes.object,
    editor: PropTypes.object
  }

  render () {
    const { reactKey, deviceKey, deviceData } = this.props
    const { images, backgroundStyle, sliderTimeout, sliderEffect } = deviceData
    let timeout = sliderTimeout
    if (!timeout) {
      timeout = 5
    }
    if (images && images.urls && images.urls.length) {
      let imagesJSX = []
      images.urls.forEach((imgData) => {
        let styles = {
          backgroundImage: `url(${imgData.full})`
        }
        let imgKey = `${reactKey}-${imgData.id}`
        imagesJSX.push((
          <div className='vce-asset-background-slider-item' style={styles} key={imgKey} />
        ))
      })
      let containerClasses = [
        `vce-asset-background-slider-container`,
        `vce-visible-${deviceKey}-only`
      ]
      if (backgroundStyle) {
        containerClasses.push(`vce-asset-background-slider--style-${backgroundStyle}`)
      }
      let slideshowClasses = [
        `vce-asset-background-slider`
      ]

      let sliderProps = {
        'data-vce-assets-slider': timeout,
        'data-vce-assets-slider-effect': sliderEffect,
        'data-vce-assets-slider-slide': '.vce-asset-background-slider-item'
      }

      let vcvHelperHTML = ReactDOMServer.renderToStaticMarkup(
        <div className={classNames(slideshowClasses)} {...sliderProps}>
          {imagesJSX}
        </div>)

      return <div className={classNames(containerClasses)}>
        <vcvhelper data-vcvs-html={vcvHelperHTML} dangerouslySetInnerHTML={{ __html: vcvHelperHTML }} />
      </div>
    }
    return null
  }
}
