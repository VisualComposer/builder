import React from 'react'
import vcCake from 'vc-cake'

const vcvAPI = vcCake.getService('api')

export default class ButtonElement extends vcvAPI.elementComponent {
  render () {
    const { id, atts, editor } = this.props
    const { buttonUrl, buttonText, shape, alignment, customClass, toggleCustomHover, metaCustomId, size, toggleStretchButton } = atts

    let containerClasses = 'vce-button--style-basic-container'
    let wrapperClasses = 'vce-button--style-basic-wrapper vce'
    let classes = 'vce-button vce-button--style-basic'
    let customProps = {}
    let CustomTag = 'button'

    if (buttonUrl && buttonUrl.url) {
      CustomTag = 'a'
      const { url, title, targetBlank, relNofollow } = buttonUrl
      customProps = {
        href: url,
        title: title,
        target: targetBlank ? '_blank' : undefined,
        rel: relNofollow ? 'nofollow' : undefined
      }
    }

    if (typeof customClass === 'string' && customClass) {
      containerClasses += ' ' + customClass
    }

    if (shape) {
      classes += ` vce-button--style-basic--border-${shape}`
    }

    if (alignment) {
      containerClasses += ` vce-button--style-basic-container--align-${alignment}`
    }

    if (size) {
      classes += ` vce-button--style-basic--size-${size}`
    }

    if (toggleStretchButton) {
      wrapperClasses += ' vce-button--style-basic-wrapper--stretched'
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

    const doMargin = this.applyDO('margin')
    const doRest = this.applyDO('padding border background animation')

    return (
      <div className={containerClasses} {...editor}>
        <span className={wrapperClasses} id={'el-' + id} {...doMargin}>
          <CustomTag className={classes} {...customProps} {...doRest}>
            {buttonText}
          </CustomTag>
        </span>
      </div>
    )
  }
}
