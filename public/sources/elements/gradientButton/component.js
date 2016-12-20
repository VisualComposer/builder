/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  render () {
    let { id, atts, editor } = this.props
    let { buttonUrl, buttonText, shape, color, designOptions, alignment, customClass, buttonType } = atts

    let containerClasses = 'vce-button-container'
    let wrapperClasses = 'vce-button-wrapper vce'
    let classes = ''
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
      classes += ` vce-button--border-${shape}`
    }

    if (alignment) {
      containerClasses += ` vce-button-container--align-${alignment}`
    }

    if (buttonType) {
      classes += ` vce-button vce-button--style-${buttonType}`
    } else {
      classes += ' vce-button vce-button--style-outline'
    }

    let mixinData = this.getMixinData('color')

    if (mixinData) {
      classes += ` vce-button--style-${buttonType}--color-${mixinData.selector}`
    }

    mixinData = this.getMixinData('hoverColor')

    if (mixinData) {
      classes += ` vce-button--style-${buttonType}--hover-color-${mixinData.selector}`
    }


    let devices = designOptions.visibleDevices ? Object.keys(designOptions.visibleDevices) : []
    let animations = []
    devices.forEach((device) => {
      let prefix = designOptions.visibleDevices[ device ]
      if (designOptions[ device ].animation) {
        if (prefix) {
          prefix = `-${prefix}`
        }
        animations.push(`vce-o-animate--${designOptions[ device ].animation}${prefix}`)
      }
    })
    if (animations.length) {
      customProps[ 'data-vce-animate' ] = animations.join(' ')
    }
    return <div className={containerClasses} {...editor}>
      <span className={wrapperClasses} id={'el-' + id} >
        <CustomTag className={classes} {...customProps}>
          {buttonHtml}
        </CustomTag>
      </span>
    </div>
  }
}
