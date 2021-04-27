import React from 'react'
import classNames from 'classnames'
import ReactDOMServer from 'react-dom/server'
import PropTypes from 'prop-types'

export default class ImageBackgroundZoom extends React.Component {
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
    const { backgroundPosition, backgroundZoom, backgroundZoomSpeed, backgroundZoomReverse } = deviceData
    if (images) {
      const imagesJSX = []
      if (images.urls && images.urls.length) {
        images.urls.forEach((imgData, index) => {
          let customKey = imgData.id
          if (!imgData.id) {
            customKey = `${imgData.full}-${index}`
          }
          const itemClasses = classNames({
            'vce-asset-background-zoom-item': true,
            vcvhelper: deviceData.lazyLoad
          })
          const props = {
            style: {
              backgroundImage: `url(${imgData.full})`
            }
          }
          const imgKey = `${reactKey}-${customKey}`
          if (deviceData.lazyLoad) {
            props['data-vcvs-html'] = `<div class="vce-asset-background-zoom-item vcv-lozad" data-background-image="${imgData.full}"></div>`
          }
          imagesJSX.push(<div className={itemClasses} {...props} key={imgKey} />)
        })
      } else if (images.length) {
        images.forEach((imgData, index) => {
          const imgKey = `${reactKey}-${imgData}-${index}`
          const itemClasses = classNames({
            'vce-asset-background-zoom-item': true,
            vcvhelper: deviceData.lazyLoad
          })
          const props = {
            style: {
              backgroundImage: `url(${this.getPublicImage(imgData)})`
            }
          }
          if (deviceData.lazyLoad) {
            props['data-vcvs-html'] = `<div class="vce-asset-background-zoom-item vcv-lozad" data-background-image="${this.getPublicImage(imgData)}"></div>`
          }
          imagesJSX.push(<div className={itemClasses} {...props} key={imgKey} />)
        })
      }
      const containerClasses = [
        'vce-asset-background-zoom-container',
        `vce-visible-${deviceKey}-only`
      ]
      if (backgroundPosition) {
        containerClasses.push(`vce-asset-background-zoom--position-${backgroundPosition}`)
      }
      const backgroundZoomClasses = classNames([
        'vce-asset-background-zoom'
      ])
      const zoomScale = 1 + (backgroundZoom / 100)
      const zoomImageScale = backgroundZoomReverse ? zoomScale : (1 / zoomScale)
      const backgroundZoomContainerStyles = backgroundZoomReverse ? {} : {
        transform: `scale(${zoomScale})`
      }
      const zoomProps = {
        'data-vce-assets-zoom': backgroundZoomReverse ? 'in' : 'out',
        'data-vce-assets-zoom-scale': zoomImageScale,
        'data-vce-assets-zoom-duration': backgroundZoomSpeed
      }
      const vcvHelperHTML = ReactDOMServer.renderToStaticMarkup(
        <div className={classNames(containerClasses)}>
          <div className='vce-asset-background-zoom--scale-helper' style={backgroundZoomContainerStyles}>
            <div className={backgroundZoomClasses} {...zoomProps}>
              {imagesJSX}
            </div>
          </div>
        </div>
      )

      return (
        <div className={classNames(containerClasses)}>
          <div className='vcvhelper' data-vcvs-html={vcvHelperHTML} dangerouslySetInnerHTML={{ __html: vcvHelperHTML }} />
        </div>
      )
    }

    return null
  }
}
