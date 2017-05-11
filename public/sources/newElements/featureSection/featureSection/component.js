import React from 'react'
import vcCake from 'vc-cake'
const vcvAPI = vcCake.getService('api')
const cook = vcCake.getService('cook')

export default class FeatureSection extends vcvAPI.elementComponent {

  getPublicImage (filename) {
    let { metaAssetsPath } = this.props.atts
    return metaAssetsPath + filename
  }

  getImageUrl (image) {
    let imageUrl
    // Move it to attribute
    if (image && image.full) {
      imageUrl = image.full
    } else {
      imageUrl = this.getPublicImage(image)
    }
    return imageUrl
  }

  render () {
    let { id, atts, editor } = this.props
    let { description, image, imagePosition, reverseStacking, addButton, customClass, button, background, metaCustomId } = atts
    let classNames = require('classnames')
    let containerProps = {}

    let containerClasses = classNames({
      'vce-feature-section-container': true,
      'vce-feature-section-media--xs': true
    })

    let wrapperClasses = classNames({
      'vce': true,
      'vce-feature-section': true,
      'vce-feature-section--min-height': true,
      'vce-feature-section--reverse': reverseStacking
    })

    let imageClasses = ['vce-feature-section--image']
    let contentClasses = ['vce-feature-section--content']

    if (typeof customClass === 'string' && customClass) {
      wrapperClasses = containerClasses.concat(' ' + customClass)
    }

    let imageStyles = {}

    if (image) {
      imageStyles.backgroundImage = `url(${this.getImageUrl(image)})`
    }

    if (imagePosition) {
      imageClasses.push(`vce-feature-section--image-${imagePosition}`)
    }

    let mixinData = this.getMixinData('backgroundColor')

    if (mixinData) {
      contentClasses.push(`vce-feature-section--background-color-${mixinData.selector}`)
    }

    let buttonOutput = ''
    if (addButton) {
      let Button = cook.get(button)
      buttonOutput = Button.render(null, false)
    }

    if (metaCustomId) {
      containerProps.id = metaCustomId
    }

    contentClasses = classNames(contentClasses)
    imageClasses = classNames(imageClasses)

    let doPadding = this.applyDO('padding')
    let doRest = this.applyDO('margin background border animation')

    return <section className={containerClasses} {...editor} {...containerProps}>
      <div className={wrapperClasses} id={'el-' + id} {...doRest}>
        <div className={imageClasses} style={imageStyles} />
        <div className={contentClasses}>
          <div className='vce-feature-section--content-container' {...doPadding}>
            <div className='vce-feature-section-description'>
              {description}
            </div>
            {buttonOutput}
          </div>
        </div>
      </div>
    </section>
  }
}
