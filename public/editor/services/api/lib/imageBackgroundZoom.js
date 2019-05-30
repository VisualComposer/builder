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
    let { metaAssetsPath } = this.props.atts
    return filename.match('^(https?:)?\\/\\/?') ? filename : metaAssetsPath + filename
  }

  render () {
    const { reactKey, deviceKey, deviceData, images } = this.props
    const { backgroundPosition, backgroundZoom, backgroundZoomSpeed, backgroundZoomReverse } = deviceData
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
            <div className='vce-asset-background-zoom-item' style={styles} key={imgKey} />
          ))
        })
      } else if (images.length) {
        images.forEach((imgData, index) => {
          let styles = {
            backgroundImage: `url(${this.getPublicImage(imgData)})`
          }
          let imgKey = `${reactKey}-${imgData}-${index}`
          imagesJSX.push((
            <div className='vce-asset-background-zoom-item' style={styles} key={imgKey} />
          ))
        })
      }
      let containerClasses = [
        `vce-asset-background-zoom-container`,
        `vce-visible-${deviceKey}-only`
      ]
      if (backgroundPosition) {
        containerClasses.push(`vce-asset-background-zoom--position-${backgroundPosition}`)
      }
      let backgroundZoomClasses = classNames([
        `vce-asset-background-zoom`
      ])
      let zoomScale = 1 + (backgroundZoom / 100)
      let zoomImageScale = backgroundZoomReverse ? zoomScale : (1 / zoomScale)
      let backgroundZoomContainerStyles = backgroundZoomReverse ? {} : {
        transform: `scale(${zoomScale})`
      }
      let zoomProps = {
        'data-vce-assets-zoom': backgroundZoomReverse ? 'in' : 'out',
        'data-vce-assets-zoom-scale': zoomImageScale,
        'data-vce-assets-zoom-duration': backgroundZoomSpeed
      }
      let vcvHelperHTML = ReactDOMServer.renderToStaticMarkup(
        <div className={classNames(containerClasses)}>
          <div className='vce-asset-background-zoom--scale-helper' style={backgroundZoomContainerStyles}>
            <div className={backgroundZoomClasses} {...zoomProps}>
              {imagesJSX}
            </div>
          </div>
        </div>
      )

      return <div className={classNames(containerClasses)}>
        <div className='vcvhelper' data-vcvs-html={vcvHelperHTML} dangerouslySetInnerHTML={{ __html: vcvHelperHTML }} />
      </div>
    }

    return null
  }
}
