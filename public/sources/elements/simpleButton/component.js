/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  render () {
    let { id, atts, editor } = this.props
    let { addUrl, buttonUrl, buttonText, shape, color, designOptions, alignment, background, customClass } = atts

    let containerClasses = 'vce-button-container vce'
    let classes = 'vce-button vce-button--style-simple'
    let buttonHtml = buttonText
    let customProps = {}
    let CustomTag = 'button'

    if (addUrl) {
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

    let mixinData = this.getMixinData('simpleColor')

    if (mixinData) {
      classes += ` vce-button--style-simple--color-${mixinData.selector}`
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
    return <div className={containerClasses} id={'el-' + id} {...editor}>
      <CustomTag className={classes} {...customProps}>
        {buttonHtml}
      </CustomTag>
    </div>
  }
}
