import React from 'react'
import { getService } from 'vc-cake'
import classNames from 'classnames'

const vcvAPI = getService('api')

export default class FeatureSection extends vcvAPI.elementComponent {
  render () {
    const { id, atts, editor, children } = this.props
    const { description, image, imageAlignment, reverseStacking, customClass, metaCustomId, backgroundImagePosition, backgroundColor, extraDataAttributes } = atts
    const containerProps = this.getExtraDataAttributes(extraDataAttributes)

    const backgroundColorSelector = [...backgroundColor.matchAll(/[\da-f]+/gi)].map(match => match[0]).join('-')

    const containerClasses = classNames({
      'vce-feature-section-container': true,
      'vce-feature-section-media--xs': true
    })

    const wrapperClasses = classNames({
      vce: true,
      'vce-feature-section': true,
      'vce-feature-section--min-height': true,
      'vce-feature-section--reverse': reverseStacking,
      [`vce-feature-section-background-color--${backgroundColorSelector}`]: backgroundColorSelector,
      [`${customClass}`]: typeof customClass === 'string' && customClass
    })

    const imageClasses = classNames({
      'vce-feature-section-image': true,
      [`vce-feature-section-image--alignment-${imageAlignment}`]: imageAlignment,
      [`vce-feature-section-image--background-position-${backgroundImagePosition.replace(' ', '-')}`]: backgroundImagePosition,
      [`vce-image-filter--${image?.filter}`]: image?.filter !== 'normal'
    })

    const imageStyles = {}

    if (image) {
      imageStyles.backgroundImage = `url(${this.getImageUrl(image)})`
    }

    if (metaCustomId) {
      containerProps.id = metaCustomId
    }

    const doPadding = this.applyDO('padding')
    const doRest = this.applyDO('margin background border animation')

    return (
      <section className={containerClasses} {...editor} {...containerProps}>
        <div className={wrapperClasses} id={'el-' + id} {...doRest}>
          <div className={imageClasses} style={imageStyles} />
          <div className='vce-feature-section-content'>
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
