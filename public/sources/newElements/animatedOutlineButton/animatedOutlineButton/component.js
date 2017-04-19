import React from 'react'
import vcCake from 'vc-cake'
const vcvAPI = vcCake.getService('api')

export default class AnimatedOutlineButtonElement extends vcvAPI.elementComponent {
  render () {
    let { id, atts, editor } = this.props
    let { buttonUrl, buttonText, color, alignment, customClass, metaCustomId } = atts

    let containerClasses = ['vce-button--style-animated-outline-container']
    let classes = []
    let buttonHtml = buttonText
    let customProps = {}
    let CustomTag = 'button'
    let buttonCustomClass = 'vce-button--style-animated-outline'
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

    if (alignment) {
      containerClasses.push(`vce-button--style-animated-outline-container--align-${alignment}`)
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
      <span className='vce-button--style-animated-outline-wrapper vce' id={'el-' + id} {...doMargin}>
        <CustomTag className={classes.join(' ')} {...customProps} {...doRest}>
          <span className='vce-button--style-animated-outline__content-box'>
            <span className='vce-button--style-animated-outline__content'>
              {buttonHtml}
            </span>
          </span>
        </CustomTag>
      </span>
    </div>
  }
}
