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
          let customKey = imgData.id
          if (!imgData.id) {
            customKey = `${imgData.full}-${index}`
          }
          const itemClasses = classNames({
            'vce-asset-background-slider-item': true,
            vcvhelper: deviceData.lazyLoad
          })
          const props = {
            style: {
              backgroundImage: `url(${imgData.full})`
            }
          }
          const imgKey = `${reactKey}-${customKey}`
          if (deviceData.lazyLoad) {
            props['data-vcvs-html'] = `<div class="vce-asset-background-slider-item vcv-lozad" data-background-image="${imgData.full}"></div>`
          }
          imagesJSX.push(<div className={itemClasses} {...props} key={imgKey} />)
        })
      } else if (images.length) {
        images.forEach((imgData, index) => {
          const props = {
            style: {
              backgroundImage: `url(${this.getPublicImage(imgData)})`
            }
          }
          const itemClasses = classNames({
            'vce-asset-background-slider-item': true,
            vcvhelper: deviceData.lazyLoad
          })
          if (deviceData.lazyLoad) {
            props['data-vcvs-html'] = `<div class="vce-asset-background-slider-item vcv-lozad" data-background-image="${this.getPublicImage(imgData)}"></div>`
          }
          const imgKey = `${reactKey}-${imgData}-${index}`
          imagesJSX.push((
            <div className={itemClasses} {...props} key={imgKey} />
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

      return (
        <div className={classNames(containerClasses)}>
          <div className='vcvhelper' data-vcvs-html={vcvHelperHTML} dangerouslySetInnerHTML={{ __html: vcvHelperHTML }} />
        </div>
      )
    }

    return null
  }
}
