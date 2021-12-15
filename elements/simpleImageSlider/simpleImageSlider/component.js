import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { getService } from 'vc-cake'

const vcvAPI = getService('api')

export default class SimpleImageSlider extends vcvAPI.elementComponent {
  render () {
    const { id, atts, editor } = this.props
    let { clickableOptions, showCaption, images, aspectRatio, customAspectRatio, scaleImage, shape, autoplay, autoplayDelay, effect, pointers, arrows, metaCustomId, customClass, backgroundImagePosition, arrowColor, arrowColorHover, pointerColor, pointerColorHover } = atts

    let containerClasses = 'vce-simple-image-slider'
    let wrapperClasses = 'vce-simple-image-slider-wrapper vce'
    let aspectClasses = 'vce-simple-image-slider-helper'
    const dotsClasses = 'vce-simple-image-slider-dots'
    const stylesVariables = {}
    const containerProps = {}
    const aspectProps = {}
    let aspectPercentage = 133

    if (aspectRatio.indexOf(':') >= 0) {
      const [aspectX, aspectY] = aspectRatio.split(':')

      aspectClasses += ` vce-simple-image-slider-aspect-ratio--${aspectX}-${aspectY}`
    } else if (aspectRatio === 'custom') {
      if (customAspectRatio.indexOf(':') >= 0) {
        let [aspectX, aspectY] = customAspectRatio.split(':')
        aspectX = parseInt(aspectX)
        aspectY = parseInt(aspectY)

        if (aspectX > 0 && aspectY > 0) {
          aspectPercentage = 100 / (aspectX / aspectY)
        }

        aspectClasses += ' vce-simple-image-slider-aspect-ratio--custom'
        aspectProps.style = { paddingTop: `${aspectPercentage}%` }
      }
    }

    if (typeof customClass === 'string' && customClass) {
      containerClasses += ` ${customClass}`
    }

    if (shape === 'rounded') {
      wrapperClasses += ' vce-simple-image-slider-shape--rounded'
    }

    if (metaCustomId) {
      containerProps.id = metaCustomId
    }

    const Slides = images.map((image, index) => {
      let customProps = {}
      let CustomTag = 'div'
      let imgClasses = 'vce-simple-image-slider-img'
      const imgTagClasses = ''
      const imgSrc = this.getImageUrl(image)
      const itemProps = {}

      if (scaleImage) {
        imgClasses += ' vce-simple-image-slider-img--scale'
      }

      if (backgroundImagePosition) {
        stylesVariables['--backgroundPosition'] = backgroundImagePosition
      }

      if (clickableOptions === 'url' && image.link && image.link.url) {
        CustomTag = 'a'
        const { url, title, targetBlank, relNofollow } = image.link
        customProps = {
          href: url,
          title: title,
          target: targetBlank ? '_blank' : undefined,
          rel: relNofollow ? 'nofollow' : undefined
        }
      } else if (clickableOptions === 'imageNewTab') {
        CustomTag = 'a'
        customProps = {
          href: imgSrc,
          target: '_blank'
        }
      } else if (clickableOptions === 'lightbox') {
        CustomTag = 'a'
        customProps = {
          href: imgSrc,
          'data-lightbox': `lightbox-${id}`
        }
      } else if (clickableOptions === 'photoswipe') {
        CustomTag = 'a'
        customProps = {
          href: imgSrc,
          'data-photoswipe-image': id,
          'data-photoswipe-index': index
        }
        if (showCaption) {
          customProps['data-photoswipe-caption'] = image && image.caption
        }
        containerProps['data-photoswipe-gallery'] = id
        itemProps['data-photoswipe-item'] = `photoswipe-${id}`
      }

      customProps.style = { backgroundImage: `url(${imgSrc})` }

      if (image.filter && image.filter !== 'normal') {
        imgClasses += ` vce-image-filter--${image.filter}`
      }

      return (
        <div className='vce-simple-image-slider-item vc-slick-item' key={`vce-simple-image-slider-item-${index}-${id}`} {...itemProps}>
          <CustomTag {...customProps} className={imgClasses}>
            <img className={imgTagClasses} src={imgSrc} style={{ opacity: '0' }} alt={(image && image.alt) || ''} />
          </CustomTag>
        </div>
      )
    })

    const doAll = this.applyDO('all')

    if (pointerColor) {
      stylesVariables['--pointerColor'] = pointerColor
    }

    if (pointerColorHover) {
      stylesVariables['--pointerColorHover'] = pointerColorHover
    }

    autoplayDelay *= 1000

    let prevArrow = ''
    let nextArrow = ''

    if (arrows) {
      const arrowClasses = 'vce-simple-image-slider-arrow'

      if (arrowColor) {
        stylesVariables['--arrowColor'] = arrowColor
      }

      if (arrowColorHover) {
        stylesVariables['--arrowColorHover'] = arrowColorHover
      }

      prevArrow = (
        <div className={`${arrowClasses} vce-simple-image-slider-prev-arrow`}>
          <svg width='16px' height='25px' viewBox='0 0 16 25'>
            <polygon id='Prev-Arrow' points='12.3743687 5.68434189e-14 0 12.3743687 12.0208153 24.395184 14.1421356 22.2738636 4.31790889 12.4496369 14.5709572 2.19658855' />
          </svg>
        </div>
      )
      nextArrow = (
        <div className={`${arrowClasses} vce-simple-image-slider-next-arrow`}>
          <svg width='16px' height='25px' viewBox='0 0 16 25'>
            <polygon id='Next-Arrow' points='3.02081528 24.395184 15.395184 12.0208153 3.37436867 1.13686838e-13 1.25304833 2.12132034 11.0772751 11.9455471 0.824226734 22.1985954' />
          </svg>
        </div>
      )
    }

    const listHTML = (
      <div
        className='vce-simple-image-slider-list'
        data-slick-autoplay={autoplay ? 'on' : 'off'}
        data-slick-autoplay-delay={`${autoplayDelay}`}
        data-slick-effect={effect}
        data-slick-dots={pointers ? 'on' : 'off'}
        data-slick-arrows={arrows ? 'on' : 'off'}
      >
        <div className='slick-list'>
          {prevArrow}
          <div className='slick-track'>
            {Slides}
          </div>
          {nextArrow}
        </div>
      </div>
    )
    let htmlString = renderToStaticMarkup(listHTML)
    htmlString += renderToStaticMarkup(<div className={dotsClasses} />)

    return (
      <div className={containerClasses} {...editor} {...containerProps} style={stylesVariables}>
        <div className={wrapperClasses} id={'el-' + id} {...doAll}>
          <div className={aspectClasses} {...aspectProps}>
            <div className='vcvhelper' data-vcvs-html={htmlString}>
              <div
                className='vce-simple-image-slider-list'
                data-slick-autoplay={autoplay ? 'on' : 'off'}
                data-slick-autoplay-delay={autoplayDelay}
                data-slick-effect={effect}
                data-slick-disable-swipe='off'
                data-slick-dots={pointers ? 'on' : 'off'}
                data-slick-arrows={arrows ? 'on' : 'off'}
              >
                <div className='slick-list'>
                  {prevArrow}
                  <div className='slick-track'>
                    {Slides}
                  </div>
                  {nextArrow}
                </div>
              </div>
              <div className={dotsClasses} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
