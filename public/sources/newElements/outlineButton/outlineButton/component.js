import React from 'react'
import vcCake from 'vc-cake'
const vcvAPI = vcCake.getService('api')

export default class OutlineButtonElement extends vcvAPI.elementComponent {
  render () {
    let { id, atts, editor } = this.props
    let { buttonUrl, buttonText, shape, color, alignment, customClass, buttonType, metaCustomId } = atts

    let containerClasses = ['vce-button--style-outline-container']

    let classes = []

    let buttonHtml = buttonText
    let customProps = {}
    let CustomTag = 'button'
    let buttonCustomClass = buttonType ? `vce-button--style-${buttonType}` : 'vce-button--style-outline'
    classes.push(buttonCustomClass)

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
      containerClasses.push(customClass)
    }

    if (shape && shape !== 'square') {
      classes.push(`vce-button--style-outline--border-${shape}`)
    }

    if (alignment) {
      containerClasses.push(`vce-button--style-outline-container--align-${alignment}`)
    }

    let mixinData = this.getMixinData('color')

    if (mixinData) {
      classes.push(`${buttonCustomClass}--color-${mixinData.selector}`)
    }

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    let doMargin = this.applyDO('margin')
    let doRest = this.applyDO('padding border background animation')

    return <div className={containerClasses.join(' ')} {...editor}>
      <span className='vce-button--style-outline-wrapper vce' id={'el-' + id} {...doMargin}>
        <CustomTag className={classes.join(' ')} {...customProps} {...doRest}>
          {buttonHtml}
        </CustomTag>
      </span>
    </div>
  }
}
