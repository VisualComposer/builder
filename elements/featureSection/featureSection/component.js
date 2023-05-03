import React from 'react'
import { getService } from 'vc-cake'
import classNames from 'classnames'

const vcvAPI = getService('api')

export default class FeatureSection extends vcvAPI.elementComponent {
  render () {
    const { id, atts, editor, children } = this.props
    const { description, imageAlignment, reverseStacking, customClass, metaCustomId, extraDataAttributes } = atts
    const containerProps = this.getExtraDataAttributes(extraDataAttributes)

    const containerClasses = classNames({
      'vce-feature-section-container': true,
      'vce-feature-section-media--xs': true
    })

    const wrapperClasses = classNames({
      vce: true,
      'vce-feature-section': true,
      'vce-feature-section--min-height': true,
      'vce-feature-section--reverse': reverseStacking,
      [`${customClass}`]: typeof customClass === 'string' && customClass
    })

    const imageClasses = classNames({
      'vce-feature-section-image': true,
      [`vce-feature-section-image--alignment-${imageAlignment}`]: imageAlignment
    })

    if (metaCustomId) {
      containerProps.id = metaCustomId
    }

    const doPadding = this.applyDO('padding')
    const doImage = this.applyDO('backgroundImage')
    const doRest = this.applyDO('margin border animation backgroundColor')

    return (
      <section className={containerClasses} {...editor} {...containerProps}>
        <div className={wrapperClasses} id={'el-' + id} {...doRest}>
          <div className={imageClasses} {...doImage} />
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
