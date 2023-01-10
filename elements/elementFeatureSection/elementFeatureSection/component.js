import React from 'react'
import { getService } from 'vc-cake'
import classNames from 'classnames'

const vcvAPI = getService('api')

export default class FeatureSection extends vcvAPI.elementComponent {
  render () {
    const { id, atts, editor, children } = this.props
    const { description, image, imageAlignment, reverseStacking, customClass, metaCustomId, backgroundImagePosition, backgroundColor, extraDataAttributes } = atts
    const containerProps = this.getExtraDataAttributes(extraDataAttributes)

    const containerClasses = classNames({
      'vce-feature-section-container': true,
      'vce-feature-section-media--xs': true
    })

    let wrapperClasses = classNames({
      vce: true,
      'vce-feature-section': true,
      'vce-feature-section--min-height': true,
      'vce-feature-section--reverse': reverseStacking
    })

    let imageClasses = ['vce-feature-section-image']
    let contentClasses = ['vce-feature-section-content']

    if (typeof customClass === 'string' && customClass) {
      wrapperClasses += ` ${customClass}`
    }

    const imageStyles = {}

    if (image) {
      imageStyles.backgroundImage = `url(${this.getImageUrl(image)})`
    }

    if (imageAlignment) {
      imageClasses.push(`vce-feature-section-image--alignment-${imageAlignment}`)
    }

    const backgroundColorSelector = [...backgroundColor.matchAll(/[\da-f]+/gi)].map(match => match[0]).join('-')
    wrapperClasses += ` vce-feature-section-background-color--${backgroundColorSelector}`

    imageClasses.push(`vce-feature-section-image--background-position-${backgroundImagePosition.replace(' ', '-')}`)

    if (metaCustomId) {
      containerProps.id = metaCustomId
    }

    if (image && image.filter && image.filter !== 'normal') {
      imageClasses.push(`vce-image-filter--${image.filter}`)
    }

    contentClasses = classNames(contentClasses)
    imageClasses = classNames(imageClasses)

    const doPadding = this.applyDO('padding')
    const doRest = this.applyDO('margin background border animation')

    return (
      <section className={containerClasses} {...editor} {...containerProps}>
        <div className={wrapperClasses} id={'el-' + id} {...doRest}>
          <div className={imageClasses} style={imageStyles} />
          <div className={contentClasses}>
            <div className='vce-feature-section-content-container' {...doPadding}>
              <div className='vce-feature-section-description'>
                {description}
              </div>
              {children}
            </div>
          </div>
        </div>
      </section>
    )
  }
}
