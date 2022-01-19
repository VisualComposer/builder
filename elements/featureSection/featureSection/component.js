import React from 'react'
import { getService } from 'vc-cake'

const vcvAPI = getService('api')
const cook = getService('cook')

export default class FeatureSection extends vcvAPI.elementComponent {
  render () {
    const { id, atts, editor } = this.props
    const { description, image, imageAlignment, reverseStacking, addButton, customClass, button, metaCustomId, backgroundImagePosition, backgroundColor } = atts
    const classNames = require('classnames')
    const containerProps = {}

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

    let buttonOutput = ''
    if (addButton) {
      const Button = cook.get(button)
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
              {buttonOutput}
            </div>
          </div>
        </div>
      </section>
    )
  }
}
