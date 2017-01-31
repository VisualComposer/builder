/* global React, vcvAPI, vcCake */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  render () {
    let { id, atts, editor } = this.props
    let { designOptions, description, align, icon, customClass, metaCustomId } = atts
    let classNames = require('classnames')
    let customProps = {}
    let customContainerProps = {}

    let containerClasses = classNames({
      'vce-feature': true,
      'vce-feature--alignment--left': align === 'left',
      'vce-feature--alignment--right': align === 'right',
      'vce-feature--alignment--center': align === 'center'
    })

    let wrapperClasses = ['vce', 'vce-feature__wrap-row']
    wrapperClasses = classNames(wrapperClasses)

    if (typeof customClass === 'string' && customClass) {
      containerClasses = containerClasses.concat(' ' + customClass)
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
    if (metaCustomId) {
      customContainerProps.id = metaCustomId
    }

    const Cook = vcCake.getService('cook')
    let Icon = Cook.get(icon)
    let iconOutput = Icon.render(null, false)

    return <section className={containerClasses} {...editor} {...customContainerProps}>
      <div className={wrapperClasses} id={'el-' + id} {...customProps}>
        {iconOutput}
        {description}
      </div>
    </section>
  }
}

