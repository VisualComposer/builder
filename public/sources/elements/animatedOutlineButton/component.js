/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  render () {
    let { id, atts, editor } = this.props
    let { buttonUrl, buttonText, color, designOptions, alignment, customClass, metaCustomId } = atts

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
