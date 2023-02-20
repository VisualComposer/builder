import React from 'react'
import { getService } from 'vc-cake'
import classNames from 'classnames'

const vcvAPI = getService('api')

export default class FeatureSection extends vcvAPI.elementComponent {
  render () {
    const { id, atts, editor, children } = this.props
    const { description, image, imageAlignment, customClass, metaCustomId, backgroundImagePosition, extraDataAttributes } = atts

    // Handle conditional classes
    const elementClasses = classNames({
      'vce': true,
      'vce-feature-section': true,
      [customClass]: typeof customClass === 'string' && customClass
    })

    const imageClasses = classNames({
      'vce-feature-section-image': true,
      [`vce-feature-section-image--alignment-${imageAlignment}`] : imageAlignment,
      [`vce-feature-section-image--background-position-${backgroundImagePosition.replace(' ', '-')}`]: true,
      [`vce-image-filter--${image.filter}`]: image?.filter && image.filter !== 'normal'
    })

    // Handle conditional props
    const containerProps = this.getExtraDataAttributes(extraDataAttributes)
    metaCustomId && (containerProps.id = metaCustomId)

    const imageStyles = {}
    image && (imageStyles.backgroundImage = `url(${this.getImageUrl(image)})`)

    // Handle design options
    const doPadding = this.applyDO('padding')
    const doRest = this.applyDO('margin background color border animation')

    return (
      <section className='vce-feature-section-container' {...editor} {...containerProps}>
        <div className={elementClasses} id={'el-' + id} {...doRest}>
          <div className={imageClasses} style={imageStyles} />
          <div className='vce-feature-section-content'>
            <div className='vce-feature-section-content-container' {...doPadding}>
              {description}
              {children}
            </div>
          </div>
        </div>
      </section>
    )
  }
}
