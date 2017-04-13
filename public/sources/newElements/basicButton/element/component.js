import React from 'react'
import vcCake from 'vc-cake'
const vcvAPI = vcCake.getService('api')

export default class ButtonElement extends vcvAPI.elementComponent {
  render () {
    let { id, atts, editor } = this.props
    let { buttonUrl, buttonText, shape, color, alignment, customClass, toggleCustomHover, metaCustomId } = atts

    let containerClasses = 'vce-button--style-basic-container'
    let wrapperClasses = 'vce-button--style-basic-wrapper vce'
    let classes = 'vce-button--style-basic'
    let buttonHtml = buttonText
    let customProps = {}
    let CustomTag = 'button'

    if (buttonUrl && buttonUrl.url) {
      CustomTag = 'a'
      let { url, title, targetBlank, relNofollow } = buttonUrl
      customProps = {
        'href': url,
        'title': title,
        'target': targetBlank ? '_blank' : undefined,
        'rel': relNofollow ? 'nofollow' : undefined
      }
    }

    if (typeof customClass === 'string' && customClass) {
      containerClasses += ' ' + customClass
    }

    if (shape && shape !== 'square') {
      classes += ` vce-button--style-basic--border-${shape}`
    }

    if (alignment) {
      containerClasses += ` vce-button--style-basic-container--align-${alignment}`
    }

    let mixinData = this.getMixinData('basicColor')

    if (mixinData) {
      classes += ` vce-button--style-basic--color-${mixinData.selector}`
    }

    if (toggleCustomHover) {
      mixinData = this.getMixinData('basicHoverColor')

      if (mixinData) {
        classes += ` vce-button--style-basic--hover-color-${mixinData.selector}`
      }
    }

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    let doMargin = this.applyDO('margin')
    let doRest = this.applyDO('padding border background animation')

    return <div className={containerClasses} {...editor}>
      <span className={wrapperClasses} id={'el-' + id} {...doMargin}>
        <CustomTag className={classes} {...customProps} {...doRest}>
          {buttonHtml}
        </CustomTag>
      </span>
    </div>
  }
}
