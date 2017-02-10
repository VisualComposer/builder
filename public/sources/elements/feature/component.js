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
      customContainerProps.id = metaCustomId
    }

    const Cook = vcCake.getService('cook')
    let Icon = Cook.get(icon)
    let iconOutput = Icon.render(null, false)

    let doAll = this.applyDO('all')

    return <section className={containerClasses} {...editor} {...customContainerProps}>
      <div className={wrapperClasses} id={'el-' + id} {...customProps} {...doAll}>
        {iconOutput}
        {description}
      </div>
    </section>
  }
}

