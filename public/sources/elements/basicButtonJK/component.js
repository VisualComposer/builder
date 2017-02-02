/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  render () {
    let { id, atts, editor } = this.props
    let { buttonUrl, buttonText, shape, color, designOptions, alignment, customClass, toggleCustomHover, metaCustomId } = atts

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

    // let devices = designOptions.visibleDevices ? Object.keys(designOptions.visibleDevices) : []
    // let animations = []
    // devices.forEach((device) => {
    //   let prefix = designOptions.visibleDevices[ device ]
    //   if (designOptions[ device ].animation) {
    //     if (prefix) {
    //       prefix = `-${prefix}`
    //     }
    //     animations.push(`vce-o-animate--${designOptions[ device ].animation}${prefix}`)
    //   }
    // })
    // if (animations.length) {
    //   customProps[ 'data-vce-animate' ] = animations.join(' ')
    // }
    if (metaCustomId) {
      customProps.id = metaCustomId
    }
    return <div className={containerClasses} {...editor}>
      <span className={wrapperClasses} id={'el-' + id}>
        <CustomTag className={classes} {...customProps} data-vce-do-apply='padding margin background border'>
          {buttonHtml}
        </CustomTag>
      </span>
    </div>
  }
}
