/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  render () {
    let { id, atts, editor } = this.props
    let { color, designOptions, alignment, customClass, width, metaCustomId } = atts
    let classNames = require('classnames')
    let customProps = {}

    let containerClasses = [ 'vce-line-separator-container' ]
    let classes = [ 'vce', 'vce-line-separator' ]

    if (typeof customClass === 'string' && customClass) {
      containerClasses.push(customClass)
    }

    if (alignment) {
      containerClasses.push(`vce-line-separator--align-${alignment}`)
    }

    let mixinData = this.getMixinData('basicColor')

    if (mixinData) {
      classes.push(`vce-line-separator--color-${mixinData.selector}`)
    }

    mixinData = this.getMixinData('separatorWidth')

    if (mixinData) {
      classes.push(`vce-line-separator--width-${mixinData.selector}`)
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

    classes = classNames(classes)
    containerClasses = classNames(containerClasses)

    let doAll = this.applyDO('all')

    return <div className={containerClasses} {...editor} {...customProps}>
      <div className={classes} id={'el-' + id} {...doAll} />
    </div>
  }
}
