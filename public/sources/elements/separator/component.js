/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  render () {
    let { id, atts, editor } = this.props
    let { color, designOptions, alignment, customClass, width } = atts
    let classNames = require('classnames')
    let customProps = {}

    let containerClasses = ['vce-line-separator-container']
    let classes = ['vce', 'vce-line-separator']

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

    classes = classNames(classes)
    containerClasses = classNames(containerClasses)

    return <div className={containerClasses} {...editor}>
      <div className={classes} {...customProps} id={'el-' + id} />
    </div>
  }
}
