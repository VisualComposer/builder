import React from 'react'
import vcCake from 'vc-cake'
const vcvAPI = vcCake.getService('api')
const cook = vcCake.getService("cook")

export default class DoubleOutlineButton extends vcvAPI.elementComponent {
  render () {
    let { id, atts, editor } = this.props
    let { buttonUrl, buttonText, shape, color, alignment, customClass, metaCustomId } = atts

    let containerClasses = [ 'vce-button--style-double-outline-container' ]

    let classes = [ 'vce-button--style-double-outline' ]

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
      containerClasses.push(customClass)
    }

    if (shape && shape !== 'square') {
      classes.push(`vce-button--style-double-outline--border-${shape}`)
    }

    if (alignment) {
      containerClasses.push(`vce-button--style-double-outline-container--align-${alignment}`)
    }

    let mixinData = this.getMixinData('color')

    if (mixinData) {
      classes.push(`vce-button--style-double-outline--color-${mixinData.selector}`)
    }

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    let doMargin = this.applyDO('margin')
    let doRest = this.applyDO('padding border background animation')

    return <div className={containerClasses.join(' ')} {...editor}>
      <span className='vce-button--style-double-outline-wrapper vce' id={'el-' + id} {...doMargin}>
        <CustomTag className={classes.join(' ')} {...customProps} {...doRest}>
          {buttonHtml}
        </CustomTag>
      </span>
    </div>
  }
}
