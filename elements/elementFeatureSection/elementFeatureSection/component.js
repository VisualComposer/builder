import React from 'react'
import { getService } from 'vc-cake'
import classNames from 'classnames'
import { setCssVariables } from 'vc-helpers'

const vcvAPI = getService('api')

export default class FeatureSection extends vcvAPI.elementComponent {
  render () {
    const { id, atts, editor, children } = this.props
    const { description, image, imageAlignment, customClass, metaCustomId, backgroundImagePosition, extraDataAttributes } = atts

    // Handle conditional classes
    const elementClasses = classNames({
      vce: true,
      'vce-feature-section': true,
      [customClass]: typeof customClass === 'string' && customClass
    })

    const imageClasses = classNames({
      'vce-feature-section-image': true,
      [`vce-image-filter--${image.filter}`]: image?.filter && image.filter !== 'normal'
    })

    // Handle css variables
    const cssVars = { backgroundImagePosition, imageAlignment, image: `url(${this.getImageUrl(image)})` }
    const styleObj = setCssVariables(cssVars)

    // Handle conditional props
    const containerProps = this.getExtraDataAttributes(extraDataAttributes)
    metaCustomId && (containerProps.id = metaCustomId)

    // Handle design options
    const doPadding = this.applyDO('padding')
    const doRest = this.applyDO('margin background color border animation')

    return (
      <section className='vce-feature-section-container' {...editor} {...containerProps} style={styleObj}>
        <div className={elementClasses} id={'el-' + id} {...doRest}>
          <div className={imageClasses} />
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
