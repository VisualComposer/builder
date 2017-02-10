/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  render () {
    let { id, atts, editor } = this.props
    let { buttonUrl, buttonText, shape, color, designOptions, alignment, customClass, buttonType, metaCustomId } = atts

    let containerClasses = ['vce-button--style-gradient-container']
    let classes = []
    let buttonHtml = buttonText
    let customProps = {}
    let CustomTag = 'button'
    let buttonCustomClass = buttonType ? `vce-button--style-${buttonType}` : 'vce-button--style-gradient-horizontal'
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
      classes.push(`vce-button--style-gradient--border-${shape}`)
    }

    if (alignment) {
      containerClasses.push(`vce-button--style-gradient-container--align-${alignment}`)
    }

    let mixinData = this.getMixinData('color')

    if (mixinData) {
      classes.push(`${buttonCustomClass}--color-${mixinData.selector}`)
    }

    mixinData = this.getMixinData('hoverColor')

    if (mixinData) {
      classes.push(`${buttonCustomClass}--hover-color-${mixinData.selector}`)
    }

    if (designOptions.device) {
      let animations = []
      Object.keys(designOptions.device).forEach((device) => {
        let prefix = (device === 'all') ? '' : device
        if (designOptions.device[ device ].animation) {
          if (prefix) {
            prefix = `-${prefix}`
          }
          animations.push(`vce-o-animate--${designOptions.device[ device ].animation}${prefix}`)
        }
      })
      if (animations.length) {
        customProps[ 'data-vce-animate' ] = animations.join(' ')
      }
    }
    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    let doMargin = this.applyDO('margin')
    let doRest = this.applyDO('padding border background')

    return <div className={containerClasses.join(' ')} {...editor}>
      <span className='vce-button--style-gradient-wrapper vce' id={'el-' + id} {...doMargin}>
        <CustomTag className={classes.join(' ')} {...customProps} {...doRest}>
          {buttonHtml}
        </CustomTag>
      </span>
    </div>
  }
}
