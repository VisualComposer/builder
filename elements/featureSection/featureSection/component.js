import React from 'react'
import { getService } from 'vc-cake'

const vcvAPI = getService('api')
const cook = getService('cook')

export default class FeatureSection extends vcvAPI.elementComponent {
  render () {
    let { id, atts, editor } = this.props
    let { description, image, imageAlignment, reverseStacking, addButton, customClass, button, metaCustomId } = atts
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

    let imageClasses = [ 'vce-feature-section-image' ]
    let contentClasses = [ 'vce-feature-section-content' ]

    if (typeof customClass === 'string' && customClass) {
      wrapperClasses += ` ${customClass}`
    }

    let imageStyles = {}

    if (image) {
      imageStyles.backgroundImage = `url(${this.getImageUrl(image)})`
    }

    if (imageAlignment) {
      imageClasses.push(`vce-feature-section-image--alignment-${imageAlignment}`)
    }

    let mixinData = this.getMixinData('backgroundColor')

    if (mixinData) {
      wrapperClasses += ` vce-feature-section-background-color--${mixinData.selector}`
    }

    mixinData = this.getMixinData('backgroundPosition')
    if (mixinData) {
      imageClasses.push(`vce-feature-section-image--background-position-${mixinData.selector}`)
    }

    let buttonOutput = ''
    if (addButton) {
      let Button = cook.get(button)
      buttonOutput = Button.render(null, false)
    }

    if (metaCustomId) {
      containerProps.id = metaCustomId
    }

    if (image && image.filter && image.filter !== 'normal') {
      imageClasses.push(`vce-image-filter--${image.filter}`)
    }

    contentClasses = classNames(contentClasses)
    imageClasses = classNames(imageClasses)

    let doPadding = this.applyDO('padding')
    let doRest = this.applyDO('margin background border animation')

    return <section className={containerClasses} {...editor} {...containerProps}>
      <div className={wrapperClasses} id={'el-' + id} {...doRest}>
        <div className={imageClasses} style={imageStyles} />
        <div className={contentClasses}>
          <div className='vce-feature-section-content-container' {...doPadding}>
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
