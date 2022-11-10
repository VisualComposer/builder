import React from 'react'
import { getService } from 'vc-cake'

const vcvAPI = getService('api')
const cook = getService('cook')

export default class FeatureDescription extends vcvAPI.elementComponent {
  validSize (size) {
    return !isNaN(size) && !!parseInt(size)
  }

  render () {
    const { id, atts, editor } = this.props
    const { description, image, addButton, button, shape, alignment, size, metaCustomId, customClass, backgroundImagePosition, extraDataAttributes } = atts
    const containerProps = this.getExtraDataAttributes(extraDataAttributes)
    let containerClasses = 'vce-feature-description vce'

    const imageSizes = window.vcvImageSizes ? window.vcvImageSizes : { thumbnail: { width: 150 }, medium: { width: 300 }, large: { width: 1024 } }

    let imageClasses = 'vce-feature-description-image'
    let imageWrapperClasses = 'vce-feature-description-image-wrapper'
    const imageStyles = {}
    const imageWrapperStyles = {}

    if (shape) {
      imageClasses += ` vce-features-shape--${shape}`
    }

    if (image) {
      imageStyles.backgroundImage = `url(${this.getImageUrl(image)})`
    }

    if (imageSizes[size] && imageSizes[size].width) {
      imageWrapperStyles.width = imageSizes[size].width + 'px'
      imageStyles.padding = '0 0 100% 0'
    } else {
      const sizes = size.split('x')
      if (sizes.length === 2 && this.validSize(sizes[0]) && this.validSize(sizes[1])) {
        imageStyles.padding = 'unset'
        imageStyles.width = sizes[0] + 'px'
        imageStyles.height = sizes[1] + 'px'
        imageWrapperStyles.width = sizes[0] + 'px'
        imageWrapperStyles.height = sizes[1] + 'px'
      } else {
        imageWrapperStyles.width = imageSizes.medium + 'px'
        imageStyles.padding = '0 0 100% 0'
      }
    }

    if (alignment) {
      imageWrapperClasses += ` vce-feature-description-image-align--${alignment}`
    }

    if (metaCustomId) {
      containerProps.id = metaCustomId
    }

    if (typeof customClass === 'string' && customClass) {
      containerClasses += ' ' + customClass
    }

    imageClasses += ` vce-feature-description-image--background-position-${backgroundImagePosition.replace(' ', '-')}`

    let buttonOutput = ''
    if (addButton) {
      const Button = cook.get(button)
      buttonOutput = Button.render(null, false)
    }

    if (image && image.filter && image.filter !== 'normal') {
      imageClasses += ` vce-image-filter--${image.filter}`
    }

    const doAll = this.applyDO('all')

    return (
      <div className={containerClasses} id={'el-' + id} {...editor} {...doAll}>
        <div {...containerProps}>
          <div className={imageWrapperClasses} style={imageWrapperStyles}>
            <div className={imageClasses} style={imageStyles} />
          </div>
          <div className='vce-feature-description-content'>
            {description}
          </div>
          {buttonOutput}
        </div>
      </div>
    )
  }
}
